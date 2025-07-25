import { Request, Response } from 'express';
import { ResultSetHeader } from 'mysql2';
import path from 'path';
import fs from 'fs';
import { z } from 'zod';
import { logger, logWithFile } from "../services/logger";
const log = logWithFile(logger, __filename);

import { AttachmentModel } from "../models";

import { Attachment } from '../types';

export const getAttachmentById = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);

  try {
    const result = await AttachmentModel.getAttachmentById(id);

    if (result.length === 0) {
      res.status(404).json({ error: "Attachment not found" });
      return;
    }

    const filePath = path.resolve(__dirname, '../../', result[0].filePath)

    res.download(filePath, result[0].fileName)
  } catch (error) {
    log.error("Error downloading attachment: ", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getHistoryAttachments = async (req: Request, res: Response): Promise<void> => {
    const historyId = parseInt(req.params.historyId, 10);

    if (isNaN(historyId)) {
        res.status(400).json({ error: "Invalid history id" });
        return;
    }

    try {
        const result: Attachment[] = await AttachmentModel.getHistoryAttachments(historyId);

        if (result.length === 0) {
            res.status(404).json({ error: "Attachments not found" });
            return;
        }

        res.status(200).json(result);
    } catch (error) {
        log.error("Error getting historyattachments: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const createSchema = z.object({
    fileType: z.string().min(1, 'File type is required'),
    historyId: z.string().min(1,'History id is required'),
})

export const createAttachment = async (req: Request, res: Response): Promise<void> => {
    const file = req.file;

    if (!file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
    }

    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: 'Invalid data', errors: parsed.error })
        return;
    }

    try {
        const metaData = {
            historyId: parseInt(req.body.historyId, 10),
            fileName: file.originalname,
            filePath: file.path,
            fileType: req.body.fileType,
            uploadDate: new Date(),
        };

        const attachmentResult: ResultSetHeader = await AttachmentModel.createAttachment(metaData);
        const attachmentId = attachmentResult.insertId;

        res.status(201).json({ message: `Attachment #${ attachmentId } created successfully` });
    } catch (error) {
        console.error("Error creating attachment:", error);
        res.status(500).json({ error: "Attachment could not be created" });
    }
}

export const deleteAttachmant = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);

    try {
        const attachment: Attachment[] = await AttachmentModel.getAttachmentById(id);
        if (!attachment) {
            res.status(404).json({ message: 'File not found' });
            return;
        }

        const filePath = path.resolve(__dirname, '../../', attachment[0].filePath);
        if (!fs.existsSync(filePath)) {
            res.status(404).json({ message: 'File no longer exists' });
            return;
        }

        fs.unlink(filePath, (err) => {
            if (err) {
                log.error('Error deleting file ', err)
                res.status(500).json({ message: 'Internal error when deleting file' });
                return;
            }
        })

        await AttachmentModel.deleteAttachmant(id);

        res.status(201).json({
          message: `Attachment deleted successfully`,
        });
    } catch (error) {
        log.error("Error deleting attachment:", error);
        res.status(500).json({ error: "Attachment could not be deleted" });
    }
}
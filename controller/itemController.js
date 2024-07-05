const multer = require("multer");
const { Item, User } = require("../model");
const { SuccessResponse, ErrorResponse } = require("../utils");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { StatusEnum } = require("../utils/enums/StatusEnum");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, "uploads");
    },
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

const createItem = async (req, res) => {
    const { name, description, initialAmount, username } = req.body;

    try {
        const user = await User.findOne({
            where: {
                username,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const uploadDir = "uploads";

        const baseName = path.basename(
            req.file.filename,
            path.extname(req.file.filename)
        );

        const lowResPath = path.join(uploadDir, `${baseName}-low.jpg`);
        const medResPath = path.join(uploadDir, `${baseName}-medium.jpg`);
        const origResPath = path.join(uploadDir, `${baseName}-original.jpg`);

        fs.renameSync(req.file.path, origResPath);

        await sharp(origResPath).resize(200, 200).toFile(lowResPath);

        await sharp(origResPath).resize(400, 400).toFile(medResPath);

        const protocol = req.protocol;
        const host = req.get("host");
        const imageUrl = {
            low: `${protocol}://${host}/uploads/${path.basename(lowResPath)}`,
            medium: `${protocol}://${host}/uploads/${path.basename(
                medResPath
            )}`,
            original: `${protocol}://${host}/uploads/${path.basename(
                origResPath
            )}`,
        };

        const item = await Item.create({
            name,
            description,
            imageUrl,
            initialAmount,
            seller: username,
            status: StatusEnum.AVAILABLE,
        });

        SuccessResponse.data = item;
        SuccessResponse.message = "Successfully created the items";
        return res.status(200).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = {
            explanation: error.message,
        };
        return res.status(400).json(ErrorResponse);
    }
};

const getAllItems = async (req, res) => {
    try {
        const items = await Item.findAll({
            where: {
                status: StatusEnum.AVAILABLE,
            },
        });
        SuccessResponse.data = items;
        SuccessResponse.message = "Successfully fetched all items";
        res.json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = {
            explanation: error.message,
        };
        return res.status(400).json(ErrorResponse);
    }
};

const getItem = async (req, res) => {
    try {
        const id = req.params.id;

        const items = await Item.findByPk(id);
        SuccessResponse.data = items;
        SuccessResponse.message = "Successfully fetched the item";
        res.json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = {
            explanation: error.message,
        };
        return res.status(400).json(ErrorResponse);
    }
};

module.exports = { createItem, getAllItems, getItem, upload };

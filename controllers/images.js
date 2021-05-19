exports.uploadImage = async function (req, res, next) {
    // TODO: check permissions
    if (req.file)
    {
        let filePath = '/public/uploads/' + req.file.filename;
        res.json({success: 'ok', path: filePath, name: req.file.originalname});
    } else {
        res.json({error: 'File not found'});
    }
}
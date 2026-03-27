const typeHrService = require('./typeHr.service');

exports.getListTypeHr = async (req, res) => {
  try {
    const { typeData, status = [], keyword } = req.body;

    const data = await typeHrService.getListTypeHr(typeData, status, keyword);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateTypeHr = async (req, res) => {
  try {
    const payload = {
      ...req.body,
    };

    const result = await typeHrService.updateTypeHr(payload);

    return res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteTypeHr = async (req, res) => {
  try {
    const { items } = req.body; // DTO[]

    const result = await typeHrService.deleteTypeHr(items);

    return res.status(200).json({
      success: true,
      message: `Xóa thành công ${result.deletedCount}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

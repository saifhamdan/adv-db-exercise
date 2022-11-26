const AppError = require('../utils/appError');
const ApiFilter = require('../utils/apiFilter');
const catchAsync = require('../utils/catchAsync');

exports.getAll = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {

    let filter = new ApiFilter(Model.find().populate(popOptions), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await filter.query;

    res.status(200).json({
      statusCode: 200,
      stauts: 'success',
      totalResults: docs.length,
      data: docs,
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id, '-__v');
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;
    if (!doc) {
      return next(new AppError('No doc Found with that ID', 404));
    }

    res.status(200).json({
      statusCode: 200,
      stauts: 'success',
      data: doc,
    });
  });

exports.createOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let doc = await Model.create({
      ...req.body,
    });
    if (popOptions) doc = await doc.populate(popOptions).execPopulate();

    res.status(201).json({
      statusCode: 201,
      stauts: 'success',
      data: doc,
    });
  });

exports.updateOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let doc = await Model.findByIdAndUpdate(
      req.params.id,
      { ...req.body },

      {
        new: true,
        runValidators: true,
      }
    );
    if (popOptions) doc = await doc.populate(popOptions).execPopulate();
    if (!doc) {
      return next(new AppError('No doc Found with that ID', 404));
    }

    res.status(200).json({
      statusCode: 200,
      stauts: 'success',
      data: doc,
    });
  });



exports.deleteOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id).populate(
      popOptions
    );
    if (!doc) {
      return next(new AppError('No doc Found with that ID', 404));
    }

    res.status(204).json({
      statusCode: 204,
      stauts: 'success',
    });
  });

exports.deleteAll = (Model) =>
  catchAsync(async (req, res, next) => {
    await Model.deleteMany();

    res.status(204).json({
      statusCode: 204,
      stauts: 'success',
    });
  });
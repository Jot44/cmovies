const service = require("./title.service.js");

async function create(req, res, next) {
  try {
    const item = await service.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

async function findAll(req, res, next) {
  try {
    const items = await service.findAll();
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
}

async function findById(req, res, next) {
  try {
    const item = await service.findById(req.params.id);
    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const item = await service.update(req.params.id, req.body);
    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await service.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { create, findAll, findById, update, remove };

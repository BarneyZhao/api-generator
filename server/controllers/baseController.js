const router = require('express').Router();

const baseService = require('../../app/services/baseService');

router.post('/api/generateApi', (req, res) => {
  baseService.generateApi(req.body).then((data) => {
    res.json(data);
  }).catch((err) => {
    console.log(err);
    res.json(err.message || err);
  });
});

router.post('/api/checkFileExist', (req, res) => {
  baseService.checkFileExist(req.body).then((data) => {
    res.json(data);
  }).catch((err) => {
    console.log(err);
    res.json(err.message || err);
  });
});

router.post('/api/getApiInfoFromWiki', (req, res) => {
  baseService.getApiInfoFromWiki(req.body).then((data) => {
    res.json(data);
  }).catch((err) => {
    console.log(err);
    res.json(err.message || err);
  });
});

module.exports = router;

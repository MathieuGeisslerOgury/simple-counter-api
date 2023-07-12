const express = require('express');
const router = express.Router();
const Counter = require('../model/counter.model');

router.get('/:namespace/:key', async (req, res) => {
  let nameSpace = req.params.namespace.trim();
  let key = req.params.key.trim();

  try {
    const result = await Counter.findOne({
      namespace: nameSpace,
      'keys.key': key,
    });

    if (result) {
      const keyValue = result.keys.find((k) => k.key === key);
      res.json({ namespace: nameSpace, key, value: keyValue.value });
    }
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;

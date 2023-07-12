const express = require('express');
const router = express.Router();
const Counter = require('../model/counter.model');

router.get('/:namespace/:key', async (req, res) => {
  try {
    let nameSpace = req.params.namespace.trim();
    let key = req.params.key.trim();

    try {
      const namespaceCount = await Counter.countDocuments({
        namespace: nameSpace,
      });
      if (namespaceCount > 0) {
        try {
          const keysCount = await Counter.countDocuments({
            namespace: nameSpace,
            'keys.key': key,
          });
          if (keysCount > 0) {
            await Counter.updateKeyValueInMongoDB({
              namespace: nameSpace,
              key: key,
            });
          } else {
            await Counter.appendNewKey({
              namespace: nameSpace,
              key: key,
            });
          }
        } catch (err) {}
      } else {
        try {
          await Counter.createNewNameSpace({
            namespace: nameSpace,
            key: key,
          });
        } catch (err) {
          res.json({ message: 'could not create new namespace', error: 500 });
        }
      }
    } catch (err) {
      res.json({ message: 'could not fetch this key', error: 404 });
    }
  } catch (err) {
    res.json({ message: 'could not fetch this namespace', error: 404 });
  }
  res.status(204).send();
});

module.exports = router;

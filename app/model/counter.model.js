const mongoose = require('mongoose');

const Key = mongoose.Schema({
  key: { type: String },
  value: { type: Number, default: 0 },
});

const CounterSchema = mongoose.Schema({
  namespace: { type: String, unique: true },
  keys: [Key],
});

const Counter = (module.exports = mongoose.model('Counter', CounterSchema));

module.exports.createNewNameSpace = async ({ namespace, key }) => {
  let newValues = {
    key: key,
    value: 1,
  };

  let newNameSpace = new Counter({
    namespace,
    keys: [newValues],
  });

  newNameSpace.save();

  return { namespace, ...newValues };
};

module.exports.appendNewKey = async ({ namespace, key }) => {
  let newValue = {
    key,
    value: 1,
  };

  try {
    const result = await Counter.updateOne(
      { namespace },
      {
        $addToSet: {
          keys: newValue,
        },
      },
    );
    console.log('new key', { result });
  } catch (e) {
    console.error(e);
    throw e;
  }

  return { namespace, ...newValue };
};

module.exports.updateKeyValueInMongoDB = async ({ namespace, key }) => {
  try {
    const result = await Counter.findOneAndUpdate(
      { namespace, 'keys.key': key },
      {
        $inc: {
          'keys.$[element].value': 1,
        },
      },
      {
        arrayFilters: [
          {
            'element.key': key,
          },
        ],
      },
    );
    console.log('updated', { result: JSON.stringify(result) });
    const keyValue = result.keys.find((k) => k.key === key);
    return {
      namespace: namespace,
      key,
      value: keyValue.value,
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
};

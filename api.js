const mongojs = require('mongojs');

const db = mongojs('contactManager', ['concacts']);

function api(app) {
  app.get('/api/contact', (request, response) => {
    const pageSize = request.query.pageSize ? parseInt(request.query.pageSize, 10) : 10;
    const firstName = request.query.firstName;
    const middleName = request.query.middleName;
    const lastName = request.query.lastName;

    const find = {};

    if (firstName) {
      find.firstName = new RegExp(firstName, 'i');
    }

    if (middleName) {
      find.middleName = new RegExp(middleName, 'i');
    }

    if (lastName) {
      find.lastName = new RegExp(lastName, 'i');
    }

    const fields = {
      firstName: 1,
      middleName: 1,
      lastName: 1,
      phone: 1,
      email: 1,
    };

    const result = db.contacts.find(find, fields).limit(pageSize, (err, docs) => {
      response.json(docs);
    });
  });

  app.get('/api/contact/:id', (request, response) => {
    const id = request.params.id;

    db.contacts.findOne({ _id: mongojs.ObjectId(id) }, (err, doc) => {
      if (err) console.log(`Error: ${err}`);
      response.json(doc);
    });
  });

  app.post('/api/contact', (request, response) => {
    db.contacts.insert(request.body, (err, doc) => {
      if (err) console.log(`Error: ${err}`);
      response.json(doc);
    });
  });

  app.put('/api/contact/:id', (request, response) => {
    const id = request.params.id;

    db.contacts.findAndModify({
      query: {
        _id: mongojs.ObjectId(id),
      },
      update: {
        $set: {
          firstName: request.body.firstName,
          middleName: request.body.middleName,
          lastName: request.body.lastName,
          phone: request.body.phone,
          email: request.body.email,
        },
      },
      new: true,
    }, (err, doc) => {
      response.json(doc);
    });
  });

  app.delete('/api/contact/:id', (request, response) => {
    const id = request.params.id;

    db.contacts.remove({ _id: mongojs.ObjectId(id) }, (err, doc) => {
      if (err) console.log(`Error: ${err}`);
      response.json(doc);
    });
  });
};

module.exports = api;

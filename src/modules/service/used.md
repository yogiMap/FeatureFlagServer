Update all users for new requirements

```javascript
User.find()
  .exec()
  .then((users) => {
    if (users.length) {
      users.forEach((user) => {
        const space = user.name.indexOf(' ');
        let firstName = user.name.slice(0, space);
        let lastName = user.name.slice(space + 1);

        let name = get(user, 'name', '');
        let phone = get(user, 'phone', null);

        if (!name) {
          name = user.email.slice(0, user.email.indexOf('@'));
          firstName = name;
          lastName = name;
        }

        if (phone && phone.startsWith('+')) {
          phone = phone.slice(1);
        }

        const codewarsId = get(user, 'codewarsId', null);

        let links = get(user, 'links', {});

        if (codewarsId) {
          links.codewarsUsername = codewarsId;
        }

        User.updateOne(
          { _id: user.id },
          {
            $set: { name, firstName, lastName, phone, links },
            $unset: { codewarsId: '' },
          },
        )
          .exec()
          .then()
          .catch();
      });

      res.status(200).json(message.success('ok'));
    } else {
      res.status(400).json(message.fail('Lecture not found'));
    }
  })
  .catch((err) => {
    res.status(400).json(message.fail(err));
  });
```

Update lessons

```javascript
Lesson.updateMany({}, { $set: { challenges: [] } }, { runValidators: true })
  .exec()
  .then((doc) => {
    if (doc) {
      res.status(200).json(message.success('ok', doc));
    } else {
      res.status(400).json(message.fail('Lecture not found'));
    }
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json(message.fail(err));
  });
```

import './config.js';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URL;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function main() {
  await client.connect();

  const users = client.db('firstProject').collection('users');
  const cities = client.db('firstProject').collection('cities');
  await users.deleteMany({});
  await cities.deleteMany({});

  await cities.insertMany([
    {
      name: 'seoul',
      population: 1000,
    },
    {
      name: 'busan',
      population: 350,
    },
    {
      name: 'cheongju',
      population: 100,
    },
  ]);

  await users.insertMany([
    {
      name: 'Foo',
      birthYear: 2000,
      contacts: [
        {
          type: 'phone',
          number: '01012341234',
        },
        {
          type: 'home',
          number: '0431231234',
        },
      ],
      city: 'seoul',
    },
    {
      name: 'Bar',
      birthYear: 2001,
      contacts: [
        {
          type: 'phone',
          number: '01012341234',
        },
        {
          type: 'home',
          number: '0431231234',
        },
      ],
      city: 'busan',
    },
    {
      name: 'Baz',
      birthYear: 2002,
      city: 'cheongju',
    },
  ]);

  // update
  // await users.updateOne(
  //   {
  //     name: 'Baz',
  //   },
  //   {
  //     $set: {
  //       name: 'Boo',
  //     },
  //   }
  // );

  // delete
  // await users.deleteOne({
  //   name: 'Baz',
  // });

  // search
  // const cursor = await users.find({
  //   'contacts.type': 'phone',
  // });

  const cursor = users.aggregate([
    {
      $lookup: {
        from: 'cities',
        localField: 'city',
        foreignField: 'name',
        as: 'city_info',
      },
    },
    {
      $match: {
        $and: [
          {
            'city_info.population': {
              $gte: 200,
            },
          },
          {
            birthYear: {
              $gte: 2001,
            },
          },
        ],
      },
    },
    {
      $count: 'num_users',
    },
  ]);

  await cursor.forEach(console.log);

  await client.close();
}

main();

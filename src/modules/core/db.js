import mongoose from 'mongoose';

export const connectionString = process.env.MONGO_CONNECTION_STRING;

export const options = {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true,
  autoIndex: false,
  useFindAndModify: false,
};

export default function mongoConnection() {
  mongoose.connect(connectionString, options).catch((err) => console.log(err));

  // When the connection is disconnected
  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
  });
}

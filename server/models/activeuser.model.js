import { Schema, model } from 'mongoose';

const activeuserSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
});

const Activeuser = model('Activeuser', activeuserSchema);

export default Activeuser;
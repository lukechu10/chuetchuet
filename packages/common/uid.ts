import { customAlphabet } from 'nanoid';

const uidAlphabet1 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const uidAlphabet2 =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const uidGen1 = customAlphabet(uidAlphabet1, 1);
const uidGen2 = customAlphabet(uidAlphabet2, 20);
const uid = () => uidGen1() + uidGen2();

export default uid;

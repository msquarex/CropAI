import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDWdq_uVHIFlxeXvmg2Va_DlFBObyrB8nA",
  authDomain: "cropai-1f3f7.firebaseapp.com",
  projectId: "cropai-1f3f7",
  storageBucket: "cropai-1f3f7.appspot.com",
  messagingSenderId: "829412701381",
  appId: "1:829412701381:web:6feef509416fdeee0b2cac",
  measurementId: "G-Z7YD29TM6S"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
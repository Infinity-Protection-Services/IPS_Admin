class FirebaseAuthBackend {
    constructor(firebaseConfig) {
    //   if (firebaseConfig) {
    //     // Initialize Firebase
    //     firebase.initializeApp(firebaseConfig);
    //   }
    }
}


let _fireBaseBackend = null;
/**
 * Initilize the backend
 * @param {*} config
 */
 const initFirebaseBackend = config => {
    if (!_fireBaseBackend) {
      _fireBaseBackend = new FirebaseAuthBackend(config);
    }
    return _fireBaseBackend;
  };
  
  /**
   * Returns the firebase backend
   */
  const getFirebaseBackend = () => {
    return _fireBaseBackend;
  };
  
  export { initFirebaseBackend, getFirebaseBackend };
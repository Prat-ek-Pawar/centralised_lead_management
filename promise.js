function getUsers() {
    fetch("https://randomuser.me/api/?results=2")
      .then((results) => {
        return results.json();
      })
      .then((data) => {
        console.log(data);
      });
  }
  
getUsers();   
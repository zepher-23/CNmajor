

document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById("delete");

toggleButton.addEventListener("click", function() {
  console.log("remove clicked!");
});

document.getElementById('delete').addEventListener('click', function() {
    // Make a POST request to the server
    let task = document.querySelector('.list');
    console.log(task);
    const firstChild = task.firstElementChild;

    fetch('/remove', { method: 'POST' });
    firstChild.remove();
    console.log(firstChild);

  });

  });
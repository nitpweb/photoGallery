async function doAjax() {
  var imageData;
  await $.ajax({
    url: 'json/',
    type: 'POST',
    dataType: 'json',
    data: {
      branch: branch,
    },
    success: (data) => {
      imageData = data.map(function (image) {
        return `
<form class="image" action="/delete" accept-charset="UTF-8" method="POST">
  <img src="https://drive.google.com/uc?id=${image}&export=download" class="d-block w-100" alt=${image}/>
  <div class="dialog-box">
   <div class="dialog-message">
      <p>Do you want to delete this image?</p>
      <input type="hidden" name="branch" value=${branch}>
      <button type="submit" name="fileId" class="yes" value=${image}>-</button>
    </div>
  </div>
</form>`;
      });
    },
  });
  await imageData.forEach((image) => {
    document.getElementById('images').innerHTML += image;
  });
  const images = document.querySelectorAll('.image');
  await images.forEach((image) => {
    let dBox = image.getElementsByClassName('dialog-box')[0];
    image.addEventListener('mouseover', function () {
      dBox.style.display = 'block';
    });
    image.addEventListener('mouseout', function () {
      dBox.style.display = 'none';
    });
  });
}

doAjax();

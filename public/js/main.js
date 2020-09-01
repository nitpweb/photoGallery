async function doAjax() {
  var imageData;
  await $.ajax({
    url: 'imgId/',
    type: 'POST',
    dataType: 'json',
    data: {
      branch: branch,
    },
    statusCode: {
      400: () => {
        alert('bad request');
      },
      404: () => {
        alert('Image not found');
      },
    },
    success: (data) => {
      imageData = data.map(function (image) {
        return `
<form class="img-box" action="/delete" accept-charset="UTF-8" method="POST">
  <img src="https://drive.google.com/uc?id=${image}&export=download" alt=${image}/>
  <div class="transparent-box">
   <div class="caption">
      <input type="hidden" name="branch" value=${branch}>
      <button type="submit" name="fileId" class="delete-btn" value=${image}>Delete &#10007;</button>
    </div>
  </div>
</form>`;
      });
    },
  });
  await imageData.forEach((image) => {
    document.getElementById('images').innerHTML += image;
  });
}

doAjax();

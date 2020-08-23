const images = document.querySelectorAll('.image');

images.forEach((image)=>{
    image.addEventListener('mouseover',function(){
        let dBox = image.childNodes[2];
        dBox.style.display="block";
    });
    image.addEventListener('mouseout',function(){
        let dBox = image.childNodes[2];
        dBox.style.display="none";
    });

})

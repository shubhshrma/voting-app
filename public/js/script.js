/*function singlePoll(){
var elementsArray = document.querySelectorAll(".poll");
console.log(elementsArray.length);
elementsArray.forEach(function(elem) {
    elem.addEventListener("click", function() {
        var title = this.value();
        console.log(title);
	    window.location.href = "/users/poll/"+title;
    });
});
}
singlePoll();*/
function singlePoll(title)
{
	console.log(title);
	window.location = "poll/"+title;
}
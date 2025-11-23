
var obj = document.getElementById('partitioned');
obj.addEventListener('keydown', stopCarret); 
obj.addEventListener('keyup', stopCarret); 

function stopCarret() {
    if (obj.value.length > 3){
        setCaretPosition(obj, 3);
    }
}

function setCaretPosition(elem, caretPos) {
    if(elem != null) {
        if(elem.createTextRange) {
            var range = elem.createTextRange();
            range.move('character', caretPos);
            range.select();
        }
        else {
            if(elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(caretPos, caretPos);
            }
            else
                elem.focus();
        }
    }
}

// #partitioned {
//   padding-left: 15px;
//   letter-spacing: 42px;
//   border: 0;
//   background-image: linear-gradient(to left, black 70%, rgba(255, 255, 255, 0) 0%);
//   background-position: bottom;
//   background-size: 50px 1px;
//   background-repeat: repeat-x;
//   background-position-x: 35px;
//   width: 220px;
//   min-width: 220px;
//   outline:none;
// }

// #divInner{
//   left: 0;
//   position: sticky;
// }

// #divOuter{
//   width: 190px; 
//   overflow: hidden;
// }


//<div id="divOuter">
//    <div id="divInner">
//        <input id="partitioned" type="text" maxlength="4" autocomplete="off" />
//    </div>
//</div>
const caesarBtn = document.querySelector('#caesar');
const vigenereBtn = document.querySelector('#vigenere');

const caesarContainer = document.querySelector('#caesar_container');
const vigenereContainer = document.querySelector('#vigenere_container');
const mainContainer = document.querySelector('#main_container');
            
const resultText = document.querySelector('#result_text');

const conditionText = document.querySelector('#condition_text');
const conditionIcon = document.querySelector('#condition_icon');

const caesarEncodingInput = [
    document.querySelector('#shift_encoding'),
    document.querySelector('#caesar_encoding')];
const caesarDecodingInput = [
    document.querySelector('#shift_decoding'),
    document.querySelector('#caesar_decoding')];
    
const vigenereEncodingInput = [
    document.querySelector('#key_encoding'),
    document.querySelector('#vigenere_encoding')];
const vigenereDecodingInput = [
    document.querySelector('#key_decoding'),
    document.querySelector('#vigenere_decoding')];

// Select type function
caesarBtn.addEventListener('click', () => {
    mainContainer.style.backgroundColor = "var(--ceaser-color)";
    caesarContainer.style.display = "flex";
    vigenereContainer.style.display = "none";
    caesarBtn.style.backgroundColor = "white";
    vigenereBtn.style.backgroundColor = "transparent";
});
vigenereBtn.addEventListener('click', () =>{
    mainContainer.style.backgroundColor = "var(--vigenere-color)";
    vigenereContainer.style.display = "flex";
    caesarContainer.style.display = "none";
    caesarBtn.style.backgroundColor = "transparent";
    vigenereBtn.style.backgroundColor = "white";
});


//clear function
function clearFunction(char, type){ //c: 시저 v: 비즈네르 / 0: encoding 1: decoding
    let target;
    if(char == 'c'){
        if(type == 0) target = caesarEncodingInput;
        if(type == 1) target = caesarDecodingInput;
    }
    if(char == 'v'){
        if(type == 0) target = vigenereEncodingInput;
        if(type == 1) target = vigenereDecodingInput;
    }
    target.forEach((el)=> el.value = "");
}

var patternUpper = /[A-Z]/;
var patternLower = /[a-z]/;
var patternAlpha = /^[a-zA-Z]*$/;
var patternNum = /^[0-9]*$/

//checkCode: 아스키코드가 [A-Za-z]를 넘어간 경우를 검사/ 값을 조정함
const bigA = 'A'.charCodeAt();
const smallA = 'a'.charCodeAt();
const bigZ = 'Z'.charCodeAt();
const smallZ = 'z'.charCodeAt();

function checkCode(code, original, type){
    if(patternUpper.test(original)){ //대문자 (A-Z를 넘어가는 경우)
        if(code > bigZ || code < bigA){
            code += 26 * type * -1;
        } 
    }
    if(patternLower.test(original)){ //소문자 (a-z를 넘어가는 경우)
        if(code > smallZ || code < smallA){
            code += 26 * type * -1;
        } 
    }
    return code;
}

const errorMessage = [
    " 값이 입력되지 않았습니다.", //null : 0
    " 0 이상 26 미만의 숫자를 입력해주세요.", //out of range : 1
    " key는 영어 대소문자로 입력해주세요." //out of condition: 2
];
//warning: 예외 발생 시 codition style 변경
function warning(errorCode){
    conditionText.style.color = "red";
    conditionIcon.style.color = "red";
    conditionText.innerText = errorMessage[errorCode];
}

//collect: 정상적으로 수행 시 codition style 변경
const stat = [" Encoding Success!", " Decoding Success!"];
function collect(code){
    conditionIcon.style.color = "green";
    conditionText.style.color = "green";
    if(code===1) conditionText.innerText = " Encoding Success!";
    else conditionText.innerText = " Decoding Success!";
}

// 시저 암호화 & 복호화
// type:1 암호화 -1 복호화
function caesarEncoding(type){
    let number;
    let inputValue;

    if(type===1){ //encoding
        number = caesarEncodingInput[0].value;
        inputValue = caesarEncodingInput[1].value;
    } else { //decoding
        number = caesarDecodingInput[0].value;
        inputValue = caesarDecodingInput[1].value;
    }
    
    inputLength = inputValue.length;
    var temp = 0;
    let result = "";

    if(!number || !inputValue){
        warning(0);
    }
    else if(!patternNum.test(number)){ //is not number
        warning(1);
    }
    else if(number >= 26){ //out of range
        warning(1);
    }
    else{ //encoding success
        collect(type);
        for(var i = 0 ; i < inputLength; i++){ 
            if(patternAlpha.test(inputValue[i])){  //특수 문자 처리
                temp = inputValue.charCodeAt(i) + number * type;
                temp = checkCode(temp, inputValue[i], type);
                
                result += String.fromCharCode(temp);
            }
            else { 
                result += inputValue[i];
            }
        }
    }
    //decoding case를 출력해야 하는 경우
    if(type === 'd' && number===0){
        result += returnAllList(inputValue);
        
    }
    resultText.innerText = 'result : ' + result;
}

// returnAllList: 모든 shift(0~25) 값에 대해 시저 복호화한 text를 return
function returnAllList(inputValue){
    var result = " ↓ shift 값에 따라 아래의 결과를 예상할 수 있습니다.\n\n";
    let inputLength = inputValue.length;

    for(var i = 0; i < 26; i++){
        result += ' '+'shift : '+ i + ' ⇒ ';
        for(var j = 0 ; j < inputLength; j++){ 
            if(patternAlpha.test(inputValue[j])){  //특수 문자 처리
                temp = inputValue.charCodeAt(j) - i;
                temp = checkCode(temp, inputValue[j], 1);
                result += String.fromCharCode(temp);
            }
            else {
                result += inputValue[j];
            }
        }
        result += '\n';
    }
    return result;
}
function vigenereEncoding(type){
    let keyValue;
    let inputValue;
    if(type===1){ //encoding
        keyValue = vigenereEncodingInput[0].value;
        inputValue = vigenereEncodingInput[1].value;
    } else{ //decoding
        keyValue = vigenereDecodingInput[0].value;
        inputValue = vigenereDecodingInput[1].value;
    }
    keyLength = keyValue.length;
    inputLength = inputValue.length;

    var temp = 0;
    let result = "";

    if(!keyValue || !inputValue){
        warning(0);
    }
    else if(!patternAlpha.test(keyValue)){ //is not number
        warning(2);
    }
    else{ //encoding success
        collect(type);
        
        let idxKey = 0;
        let keyCode = [];

        keyValue = keyValue.toUpperCase();
        
        for(var i = 0 ; i < keyLength; i++){
            keyCode[i] = keyValue[i].charCodeAt() - bigA;
        }
        for(var i = 0 ; i < inputLength; i++){ 
            if(patternAlpha.test(inputValue[i])){  //특수 문자 처리
                temp = inputValue.charCodeAt(i) + type * keyCode[(idxKey % keyLength)];
                temp = checkCode(temp, inputValue[i], type);
                result += String.fromCharCode(temp);
                idxKey++;
            }
            else { 
                result += inputValue[i];
            }
        }
    }
    resultText.innerText = 'result : ' + result;
}


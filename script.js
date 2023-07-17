
const caesarBtn = document.querySelector('#caesar');
const vigenereBtn = document.querySelector('#vigenere');

const selectContainer = document.querySelector('#select_container');
const caesarContainer = document.querySelector('#caesar_container');
const vigenereContainer = document.querySelector('#vigenere_container');
const mainContainer = document.querySelector('#main_container');

const resultText = document.querySelector('#result_text');
const resultIcon = document.querySelector('#result_icon');
const resultContainer = document.querySelector('#result_container');//지금필요없음

const conditionText = document.querySelector('#condition_text');
const conditionIcon = document.querySelector('#condition_icon');


caesarBtn.addEventListener('click', () => {
    mainContainer.style.backgroundColor = "#ffe59e";
    caesarContainer.style.display = "flex";
    vigenereContainer.style.display = "none";
    caesarBtn.style.backgroundColor = "white";
    vigenereBtn.style.backgroundColor = "transparent";
});
vigenereBtn.addEventListener('click', () =>{
    mainContainer.style.backgroundColor = "#8CC0DE";
    vigenereContainer.style.display = "flex";
    caesarContainer.style.display = "none";
    caesarBtn.style.backgroundColor = "transparent";
    vigenereBtn.style.backgroundColor = "white";
});

//clear function
function caesarClear(code){
    if(code){
        document.querySelector('#shift_encoding').value = "";
        document.querySelector('#caesar_encoding').value = "";
    }
    else{
        document.querySelector('#shift_decoding').value = "";
        document.querySelector('#caesar_decoding').value = "";
    }
}
function vigenereClear(code){
    if(code){
        document.querySelector('#key_encoding').value = "";
        document.querySelector('#vigenere_encoding').value = "";
    }
    else{
        document.querySelector('#key_decoding').value = "";
        document.querySelector('#vigenere_decoding').value = "";
    }
}

var patternUpper = /[A-Z]/;
var patternLower = /[a-z]/;
var patternAlpha = /^[a-zA-Z]*$/;
var patternNum = /^[0-9]*$/


//checkCode: 아스키코드가 [A-Za-z]를 넘어간 경우를 검사/ 값을 조정함
const minUpper = 'A'.charCodeAt();
const minLower = 'a'.charCodeAt();
const maxUpper = 'Z'.charCodeAt();
const maxLower = 'z'.charCodeAt();

amount = [-26, +26];

function checkCode(code, original, type){
    if(patternUpper.test(original)){ //대문자 (A-Z를 넘어가는 경우)
        if(code > maxUpper || code < minUpper){
            code += amount[type];
        } 
    }
    
    if(patternLower.test(original)){ //소문자 (a-z를 넘어가는 경우)
        if(code > maxLower || code < minLower){
            code += amount[type];
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
    conditionText.innerText = stat[code];
}

// 시저 암호화
function caesarEncoding(){
    var inputValue = document.querySelector('#caesar_encoding').value;
    var number = document.querySelector('#shift_encoding').value;

    inputLength = inputValue.length;
    var temp = 0;
    
    result = "";
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
        collect(0);
        for(var i = 0 ; i < inputLength; i++){ 
            if(patternAlpha.test(inputValue[i])){  //특수 문자 처리
                temp = parseInt(number) + inputValue.charCodeAt(i) ;
                temp = checkCode(temp, inputValue[i], 0);
                
                result += String.fromCharCode(temp);
            }
            else { 
                result += inputValue[i];
            }
        }
        resultText.innerText = 'result : ' + result;
    }
    
}

// returnAllList: 모든 shift(0~25) 값에 대해 시저 복호화한 text를 return
function returnAllList(inputValue, inputLength){
    var result = " ↓ shift 값에 따라 아래의 결과를 예상할 수 있습니다." + '\n'+'\n';
    
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

// 시저 복호화
function caesarDecoding(){
    var inputValue = document.querySelector('#caesar_decoding').value;
    var guess = document.querySelector('#shift_decoding').value;
    
    inputLength = inputValue.length;

    result = "";

    if(!guess || !inputValue){
        warning(0);
    }
    else if(!patternNum.test(guess)){ //is not number
        warning(1);
    }
    else if(guess >= 26){ //out of range
        warning(1);
    }
    else if(guess == 0){ //specific case
        collect(1);
        result += returnAllList(inputValue, inputLength);
        resultText.innerText = result;
    }
    else{
        collect(1);
        for(var i = 0 ; i < inputLength; i++){ 
            if(patternAlpha.test(inputValue[i])){  //특수 문자 처리
                console.log(inputValue.charCodeAt(i));
                temp = inputValue.charCodeAt(i) - guess;
                console.log(temp);
                temp = checkCode(temp, inputValue[i], 1);
                result += String.fromCharCode(temp);
            }
            else {
                result += inputValue[i];
            }
        }
        result += '\n'+'\n -----'+'\n';
        result += returnAllList(inputValue, inputLength);

        
        resultText.innerText = 'result : ' + result;
    }
    
    
}

// 비즈네르 암호화
function vigenereEncoding(){
    var inputValue = document.querySelector('#vigenere_encoding').value;
    var keyValue = document.querySelector('#key_encoding').value;

    result = "";

    if (!keyValue || !inputValue){ //key가 입력되지 않은 경우
        warning(0);
    }
    else{
        if(!patternAlpha.test(keyValue)){ //key에 특수문자가 입력된 경우 예외 처리
            warning(2);
        }
        else{  
            collect(0);
            keyLength = keyValue.length;
            inputLength = inputValue.length;

            var idxKey = 0;
            var keyCode = [] //key값의 아스키코드 저장(0~25의 숫자로 변환)

            var temp = 0;

            keyValue = keyValue.toUpperCase();

            for(var i = 0; i < keyLength; i++){
                keyCode[i] = keyValue[i].charCodeAt() - minUpper;
            }
            for(var i = 0 ; i < inputLength; i++){
                if(patternAlpha.test(inputValue[i])){ //특수 문자 처리
                    temp = inputValue.charCodeAt(i)+keyCode[(idxKey % keyLength)]; //아스키코드 수정
                    temp = checkCode(temp, inputValue[i], 0);
                    result += String.fromCharCode(temp);
                    idxKey += 1;
                }
                else{
                    result += inputValue[i];
                }
            }
            resultText.innerText = 'key = '+ keyValue + '\n' + 'result : ' + result;
        }
    }
    
}

// 비즈네르 복호화
function vigenereDecoding(){
    var inputValue = document.querySelector('#vigenere_decoding').value;
    var keyValue = document.querySelector('#key_decoding').value;

    result = "";
    if (!keyValue || !inputValue){
        warning(0);
    }
    else{
        keyLength = keyValue.length;
        inputLength = inputValue.length;
        
        if(!patternAlpha.test(keyValue)){
            warning(2);
        }
        else{
            collect(1);
            var idxKey = 0;
            var keyCode = []
            var temp = 0;

            keyValue = keyValue.toUpperCase();

            for(var i = 0; i < keyLength; i++){
                keyCode[i] = keyValue[i].charCodeAt() - minUpper;
            }
            for(var i = 0 ; i < inputLength; i++){
                temp = inputValue.charCodeAt(i)-keyCode[(idxKey % keyLength)]; //아스키코드 수정

                //대문자 (A를 넘어가는 경우)
                if(patternUpper.test(inputValue[i])){
                    if(temp < minUpper){
                        temp += 26;
                    } 
                    result += String.fromCharCode(temp);
                }
                //소문자 (a를 넘어가는 경우)
                else if(patternLower.test(inputValue[i])){
                    if(temp < minLower){
                        temp += 26;
                    } 
                    result += String.fromCharCode(temp);
                }
                else {
                    //특수 문자 처리
                    result += inputValue[i];
                    idxKey -= 1;
                }
                idxKey += 1;
            }
            resultText.innerText = 'key = '+ keyValue + '\n'+ 'result : ' + result;
        }

    }
}
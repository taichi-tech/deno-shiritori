// deno-lint-ignore-file
import { serve } from "https://deno.land/std@0.138.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";

let previousWord = random_first_word();
let used_words = new Array();
console.log("Listening on http://localhost:8000");

serve(async (req) => {
    const pathname = new URL(req.url).pathname;
    console.log(pathname);
    console.log("previouseword = ",previousWord);
    if(req.method === "GET" &&
        pathname === "/shiritori"){
        refresh();
        return new Response(JSON.stringify(used_words));
    }
    console.log("used_word = ",used_words);

    if (req.method === "POST" && pathname === "/shiritori") {
        const requestJson = await req.json();
        const nextWord = requestJson.nextWord;
        console.log("nextword = ",nextWord);
        console.log("next_used = ",nextWord)
        console.log("requestjson = ",requestJson);
        console.log("previouseword = ",previousWord)


        if(nextWord.length === 0) {
            return new Response("文字を入力してください",{status: 400});
        }

        if(nextWord.length > 0 && previousWord.charAt(previousWord.length - 1) !==
        nextWord.charAt(0)){
            return new Response("前の単語に続いていません。", {status: 400});
        }

        if(nextWord.length > 0 && nextWord.charCodeAt(nextWord.length -1 ) ===  12435 ) {
            refresh();
            return new Response("「ん」で終わっています。", { status: 400 });
        }

        used_words.push(nextWord);
        previousWord = nextWord;
        console.log("used_words = ",used_words);
        return new Response(json.stringify(used_words));
    }

    return serveDir(req, {
        fsRoot: "public",
        urlRoot: "",
        showDirListing: true,
        enableCors: true,
    });
});
function random_first_word(){
    const word = [
        'めんま',
        'まりも',
        'すし',
        'ほんだけいすけ',
        'コムドット',
        'まんざい',
        'めいと',
        'ぼーる',
        'せんせい',
        'そしな',
        'こうち',
        'るぱん'
    ]
    const previousWord = word[Math.floor(Math.random()*word.length)];
    return previousWord;
}

function refresh() {
    used_words.splice(0);
    //console.log(used_words);
    previousWord = random_first_word();
    //console.log(previousWord);
    used_words.push(previousWord);
}

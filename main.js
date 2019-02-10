var HM = {};
HM.col = 9; // 列数
HM.row = 9; // 行数
HM.mine = 10; // 设定雷数
HM.suc = 0;
HM.getState = function(col, row) {
    var rest = (HM.col-col)*HM.row+(HM.row-row)+1;
    console.log(rest,HM.mine-HM.readyMine);
    if ((HM.mine-HM.readyMine)>=rest) {return true}
    if (HM.readyMine>=HM.mine) {return 0}
    var code = Math.floor(Math.random()*100+1);
    if (HM.mineArray[code] == 0) {
        HM.readyMine++;
        return true;
    }
    if (HM.mineArray[code] == 1) {return 0}
}
HM.setLocalBest = function(t,col,row,mine) {
    localStorage.setItem(col+"*"+row+"_"+mine,t);
}
HM.getLocalBest = function(col,row,mine) {
    var r = localStorage.getItem(col+"*"+row+"_"+mine);
    if(r===null) {return false}
    return parseInt(r);
}
HM.timerStart = function() {
    window.t = setInterval("HM.timer++",1000);
}
HM.timerStop = function() {
    clearInterval(window.t);
    return HM.timer;
}
HM.showLoading = function() {
    document.getElementById("loading").style.display = "block";
    document.getElementById("loading").style.opacity = "1";
}
HM.hideLoading = function() {
    setTimeout(function() {
        document.getElementById("loading").style.opacity = "0";
        document.getElementById("loading").style.display = "none";
    },400);
}
HM.fail = function() {
    clearInterval(HM.r);
    HM.timerStop();
    HM.col = 9;
    HM.row = 9;
    HM.mine = 10;
    HM.readyMine = 0;
    HM.restOfMine = HM.mine;
    HM.restOfBox = HM.col*HM.row-HM.mine;
    HM.restOfMark = HM.mine;
    HM.timer = 0;
    var e = document.getElementsByClassName("inside");
    for (var i = 0;i<=e.length-1;i++) {
        document.getElementsByClassName("inside")[i].classList.add("clicked");
        document.getElementsByClassName("inside")[i].onclick = "";
        document.getElementsByClassName("inside")[i].oncontextmenu = "";
        if (document.getElementsByClassName("inside")[i].dataset.mine == "mine") {
            document.getElementsByClassName("inside")[i].className = "inside mine clicked red";
        }
    }
    HM.alert("失败了", "再接再厉", "确定", function(){});
}
HM.succeed = function() {
    clearInterval(HM.r);
    if (HM.clickStep == 1) {
        HM.cId = HM.firstClick;
        HM.check();
        return;
    }
    var time = HM.timerStop();
    HM.col = 9;
    HM.row = 9;
    HM.mine = 10;
    HM.readyMine = 0;
    HM.restOfMine = HM.mine;
    HM.restOfBox = HM.col*HM.row-HM.mine;
    HM.restOfMark = HM.mine;
    HM.timer = 0;
    var e = document.getElementsByClassName("inside");
    for (var i = 0;i<=e.length-1;i++) {
        document.getElementsByClassName("inside")[i].oncontextmenu = null;
        document.getElementsByClassName("inside")[i].onclick = null;
    }
    var pastBest = HM.getLocalBest(HM.col,HM.row,HM.mine);
    var text = "";
    if (!(pastBest===false)) {
        text = "<br>历史纪录:"+pastBest+"秒";
        if(time<=pastBest) {text = "<br>恭喜你，打破纪录！历史纪录:"+pastBest+"秒";HM.setLocalBest(time,HM.col,HM.row,HM.mine)}
    } else {
        HM.setLocalBest(time,HM.col,HM.row,HM.mine);
    }
    HM.alert("成功！", "本次用时"+time+"秒"+text, "继续", function(){});//HM.show("成功！\n本次用时"+time+"秒"+text);
}
HM.searchEmpty = function(col, row) {
    if (col>=1 && row>=1 && col<=HM.col && row<=HM.row) {
        if (document.getElementById(col+"_"+row).dataset.clicked == "false") {
            if (document.getElementById(col+"_"+row).dataset.marked == "true") {HM.fail();return;}
            document.getElementById(col+"_"+row).dataset.clicked = "true";
            // HM.restOfBox--;
            // console.log("-1 now");
            document.getElementById(col+"_"+row).className = "inside clicked";
            if (document.getElementById(col+"_"+row).dataset.mine == "empty") {
                HM.clearAround(col, row);
            }
        }
    }
}
HM.clearAround = function(col, row) {
    HM.searchEmpty(parseInt(col)-1, parseInt(row)-1);
    HM.searchEmpty(parseInt(col), parseInt(row)-1);
    HM.searchEmpty(parseInt(col)+1, parseInt(row)-1);
    HM.searchEmpty(parseInt(col)-1, parseInt(row));
    HM.searchEmpty(parseInt(col)+1, parseInt(row));
    HM.searchEmpty(parseInt(col)-1, parseInt(row)+1);
    HM.searchEmpty(parseInt(col), parseInt(row)+1);
    HM.searchEmpty(parseInt(col)+1, parseInt(row)+1);
}
HM.mark = function(col,row) {
    if (document.getElementById((col)+"_"+(row)).dataset.marked == "false") {
        if (HM.restOfMark<=0){return}
        if (document.getElementById((col)+"_"+(row)).dataset.clicked=="true"){return}
        if (HM.mainArray[col][row]===true) {
            HM.restOfMine--;
        }
        document.getElementById((col)+"_"+(row)).className = "inside marked";
        document.getElementById((col)+"_"+(row)).dataset.marked = "true";
        HM.restOfMark--;
    } else {
        if (document.getElementById((col)+"_"+(row)).dataset.clicked=="true"){return}
        if (HM.mainArray[col][row]===true) {
            HM.restOfMine++;
        }
        document.getElementById((col)+"_"+(row)).className = "inside";
        document.getElementById((col)+"_"+(row)).dataset.marked = "false";
        HM.restOfMark++;
    }
}
HM.load = function() {
    HM.showLoading();
    HM.mCount = 0;
    HM.cId = "";
    HM.firstClick = "";
    HM.clickStep = 0;
    HM.check();
    document.getElementsByClassName("btn")[0].style.display = "inline";
    HM.hideLoading();
    HM.timerStart();
}
HM.checkSuc = function() {
    console.log("checked");
    if (HM.suc >= 1) {return}
    var e = document.getElementsByClassName("inside");
    var count = 0;
    for (var i = 0;i<=e.length-1;i++) {
        console.log(i, document.getElementsByClassName("inside")[i].dataset.mine, document.getElementsByClassName("inside")[i].dataset.clicked);
        // console.log(document.getElementsByClassName("inside")[i].dataset.mine, document.getElementsByClassName("inside")[i].dataset.clicked)
        if (document.getElementsByClassName("inside")[i].dataset.mine != "mine" && document.getElementsByClassName("inside")[i].dataset.clicked == "true") {
            count++;
        }
    }
    console.log(count);
    if (count==HM.col*HM.row-HM.mine) {HM.succeed();HM.suc++;}
}
HM.check = function() {
    HM.restOfMine = HM.mine;
    HM.restOfBox = HM.col*HM.row-HM.mine;
    HM.restOfMark = HM.mine;
    HM.timer = 0;
    HM.readyMine = 0;
    HM.suc = 0;

    // 加载雷区概率数组
    HM.mineArray = new Array();
    var pro = Math.round(HM.mine/(HM.col*HM.row)*100);
    for (var i = 1;i<=100;i++) {
        if (i<=pro) {
            HM.mineArray[i] = 0;
        } else {
            HM.mineArray[i] = 1;
        }
    }

    // 加载主数组
    HM.mainArray = new Array();
    for (var i = 1;i<=HM.col;i++) {
        HM.mainArray[i] = new Array();
        for (var j = 1;j<=HM.row;j++) {
            HM.mainArray[i][j] = HM.getState(i,j);
        }
    }

    // 逻辑&绘制
    document.getElementById("mainBox").style.width = (40*HM.col+10)+"px";
    document.getElementById("mainBox").style.height = (40*HM.row+10)+"px";
    document.getElementById("mainBox").innerHTML = "";
    for (var i = 1;i<=HM.col;i++) {
        var col = document.createElement("div");
        col.className = "col";
        for (var j = 1;j<=HM.row;j++) {
            var box = document.createElement("div");
            if(!(HM.mainArray[i][j] === true)) {
                box.className = "inside";
                var count = 0;
                if(i-1>=1 && j-1>=1) {
                    var xb = HM.mainArray[i-1][j-1];
                    if(xb===true){count++}
                }
                if(j-1>=1) {
                    var b = HM.mainArray[i][j-1];
                    if(b===true){count++}
                }
                if(i+1<=HM.col && j-1>=1) {
                    var db = HM.mainArray[i+1][j-1];
                    if(db===true){count++}
                }
                if(i-1>=1) {
                    var x = HM.mainArray[i-1][j];
                    if(x===true){count++}
                }
                if(i+1<=HM.col) {
                    var d = HM.mainArray[i+1][j];
                    if(d===true){count++}
                }
                if(i-1>=1 && j+1<=HM.row) {
                    var xn = HM.mainArray[i-1][j+1];
                    if(xn===true){count++}
                }
                if(j+1<=HM.row) {
                    var n = HM.mainArray[i][j+1];
                    if(n===true){count++}
                }
                if(i+1<=HM.col && j+1<=HM.row) {
                    var dn = HM.mainArray[i+1][j+1];
                    if(dn===true){count++}
                }
                console.log(count);
                if(count==0) {
                    box.dataset.mine = "empty";
                    box.dataset.col = i;
                    box.dataset.row = j;
                } else {
                    box.dataset.mine = count.toString();
                    box.dataset.col = i;
                    box.dataset.row = j;
                    var num = document.createTextNode(count.toString());
                    var p = document.createElement("p");
                    p.appendChild(num);
                    box.appendChild(p);
                }
            } else {
                box.dataset.mine = "mine";
                box.className = "mine inside";
                box.dataset.col = i;
                box.dataset.row = j;
            }
            box.id = box.dataset.col.toString()+"_"+box.dataset.row.toString();
            box.dataset.clicked = "false";
            box.dataset.marked = "false";
            box.onclick = function() {
                if (this.dataset.marked != "true") {
                    if (HM.clickStep==0) {
                        HM.firstClick = this.id;
                    }
                    HM.clickStep++;
                    if (HM.mCount == 0 && this.dataset.mine=="mine") {
                        // console.log("What the fuck is this",this.id);
                        HM.mCount++;
                        HM.cId = this.id;
                        HM.check();
                        return;
                    } else {
                        HM.mCount++;
                    }
                    if (this.dataset.mine=="mine") {
                        HM.fail();
                    } else if (this.dataset.mine=="empty") {
                        // HM.restOfBox--;
                        // console.log("-1 now");
                        this.dataset.clicked = "true";
                        this.className = "inside clicked";
                        HM.clearAround(this.dataset.col,this.dataset.row);
                    } else {
                        // console.log(this.dataset.mine+"FFFFF");
                        // HM.restOfBox--;
                        // console.log("-1 now");
                        this.dataset.clicked = "true";
                        this.className = "inside clicked";
                        HM.checkSuc();
                    }
                    // if (HM.restOfBox<=0) {
                    //     HM.succeed();
                    // }
                }
            }
            box.oncontextmenu = function() {
                if (this.dataset.clicked=="true") {
                    return;
                } else {
                    HM.mark(this.dataset.col,this.dataset.row);
                }
                return false;
            }
            col.appendChild(box);
        }
        document.getElementById("mainBox").appendChild(col);
    }
    if (HM.mCount>0) {
        //alert("hey");
        if (document.getElementById(HM.cId).dataset.mine == "mine") {
            //alert("x");
            HM.check();
        } else {
            //alert("y");
            document.getElementById(HM.cId).click();
        }
    }
    HM.r = setInterval("HM.checkSuc()",1000);
}

HM.alert = function(title, content, btn, next) {
    document.getElementById("alertBox_title").textContent = title;
    document.getElementById("alertBox_content").innerHTML = content;
    document.getElementById("alertBox_button").textContent = btn;
    document.getElementById("alertBox_button").onclick = function() {
        document.getElementById("alertBox").style.opacity = "0";
        document.getElementById("page_content").style.filter = "none";
        document.getElementById("alertBox").style.display = "none";
        next();
    }
    document.getElementById("alertBox").style.display = "inline";
    document.getElementById("alertBox").style.opacity = "1";
    document.getElementById("page_content").style.filter = "blur(4px)";
}
/*
	Ball对象可以创建小球
	create()创建小球
	move_go()开始移动
	move_stop()停止移动
	move()移动函数，其中调用了撞击检测
	remove()删除小球
	collideListener()墙壁撞击检测，撞墙collideDegree次后小球开始向目标移动
	collide()小球互相碰撞检测
	collideTargetL()目标撞击检测
	targetAnimet()撞击目标后，对目标的处理函数
*/ 
var windowSize={width:0,height:0};
var ball_glo={};
ball_glo.collideE_all=[];
function Ball(opt){
	this.config={
		id:"",
		width:50,
		height:50,
		thisball:"",
		class:"ball",
		top:0,
		left:0,
		content:"",
		speed:15,
		angle:0,
		target:null,
		collideDegree:2
	}
	this.config=b_extend(this.config,opt);
	this.timer=null;
	this.create();
	this.collideCode=0;
	
}
Ball.prototype={
	/*创建球体*/
	create:function(){
		
		var _body=document.getElementsByTagName("body")[0];
		var ball=document.createElement("div");
		this.config.id=createCode();
		ball.innerHTML=this.config.content;
		ball.setAttribute("class",this.config.class+" collideE");
		ball.style.cssText="top:"+this.config.top+"px;left:"+this.config.left+"px;width:"+this.config.width+"px;height:"+this.config.height+"px;line-height:"+this.config.height+"px";
		//ball.angle=this.config.angle;
		//ball.target=this.config.target;
		//console.log(this.config.id);
		this.config.thisball=ball;
		this.config.thisball.id=this.config.id;
		_body.appendChild(ball);
	},
	/*开始移动*/
	move_go:function(){
		var that=this;
		this.timer=setInterval(function(){
			that.move();
		},30)
	},
	/*停止移动*/
	move_stop:function(){
		clearInterval(this.timer);
		this.remove();
	},
	/*移动函数*/
	move:function(){
		//通过角度计算移动坐标
		var that=this;
		var y=this.config.speed*Math.sin(this.config.angle*Math.PI/180),
			x=this.config.speed*Math.cos(this.config.angle*Math.PI/180);
		//console.log(this.config.top+"__"+this.config.left);
		this.config.top+=y;
		this.config.left+=x;
		this.config.thisball.style.left=this.config.left+"px";
		this.config.thisball.style.top=this.config.top+"px";
		this.config.thisball.pixelTop=this.config.top;
		this.config.thisball.pixelLeft=this.config.left;
		this.config.thisball.pixelWidth=this.config.width;
		this.config.thisball.pixelHeight=this.config.height;
		this.config.thisball.centerTop=this.config.top+this.config.height/2;
		this.config.thisball.centerLeft=this.config.left+this.config.width/2;
		this.collideListener();
		this.collide();
		//撞壁够次数后，开始加入目标撞击检测
		if(that.collideCode>=that.config.collideDegree&&that.config.target!=null){
			this.collideTargetL();
		}
		
	},
	/*清除*/
	remove:function(){
		var _body=document.getElementsByTagName("body")[0];
		_body.removeChild(this.config.thisball);
		ball_glo.collideE_all=document.querySelectorAll(".collideE");
		var that=this;
		this.targetAnimet();
	},
	/*撞击目标后的处理动画*/
	targetAnimet:function(){
		var that=this;
		
		this.config.target.style.background="#900";
		this.config.target.style.color="#fff";
		
		if(jQuery){
			var $_body=$("#mainbox");
			var targetClone=this.config.target.cloneNode(true);
			var $thistarget=$(that.config.target)
			$_body.append(targetClone);
			$(targetClone).css({top:$thistarget.offset().top-$thistarget.height()/4,left:$thistarget.offset().left-$thistarget.width()/4,position:"absolute"}).width($thistarget.width()*1.5).height($thistarget.height()*1.5);
			$(targetClone).animate({width:$thistarget.width(),height:$thistarget.height(),opacity:0,top:$thistarget.offset().top,left:$thistarget.offset().left},500,function(){
				$(this).remove();
			})
		}
		
		
	},
	/*墙壁碰撞监听*/
	collideListener:function(){
		var y_angle=0-this.config.angle;
		var x_angle=180-this.config.angle;
		var collided=false;
		var that=this;
		var ratioX=20,
			ratioY=25;
		
		if(this.config.left<1){
			this.config.left=1;
			updataAngle(x_angle,"left");
		}
		if(this.config.left>(windowSize.width-this.config.width-ratioX)){
			this.config.left=windowSize.width-this.config.width-ratioX;
			updataAngle(x_angle,"right");
		}
		if(this.config.top<1){
			this.config.top=1;
			updataAngle(y_angle,"top");
		}
		if(this.config.top>(windowSize.height-this.config.height-ratioY)){
			
			this.config.top=windowSize.height-this.config.height-ratioY
			updataAngle(y_angle,"bottom");
		}
		if(this.config.left<1&&this.config.top<1){
			
			updataAngle(45,"lt");
		}
		if(this.config.left>(windowSize.width-this.config.width-10)&&this.config.top>(windowSize.height-this.config.height-15)){
			
			updataAngle(225,"rb");
		}
		if(this.config.left<1&&this.config.top>(windowSize.height-this.config.height-ratioY)){
			
			updataAngle(315,"lb");
		}
		if(this.config.top<1&&this.config.left>(windowSize.width-this.config.width-ratioX)){
			
			updataAngle(135,"rt");
		}
		//撞墙处理函数
		function updataAngle(an,tar){
			//console.log(that.collideCode+":"+that.config.target.innerHTML);
			if(that.config.thisball.collideTarget==tar){
				that.config.angle=an;
				that.config.thisball.collideTarget=tar;
			}else{
				if(that.collideCode>=that.config.collideDegree&&that.config.target!=null){
				//改变角度，向目标移动
					that.config.angle=targetAngle({x:that.config.target.offsetLeft,y:that.config.target.offsetTop},{x:that.config.thisball.pixelLeft,y:that.config.thisball.pixelTop});
					//console.log(that.collideCode+":"+that.config.target.innerHTML+":"+that.config.angle);
					that.config.thisball.collideTarget=tar;
				}else{
					that.config.angle=an;
					that.config.thisball.collideTarget=tar;
				}
			}
			
			collided=true;
			that.collideCode++;
		}
		
	},
	//目标撞击检测函数
	collideTargetL:function(){
		var that=this;
		var targetCLeft=this.config.target.offsetLeft+this.config.target.offsetWidth/2,
			targetCTop=this.config.target.offsetTop+this.config.target.offsetHeight/2;
		var c_x=Math.abs(this.config.thisball.centerLeft-targetCLeft),
			c_y=Math.abs(this.config.thisball.centerTop-targetCTop);
		if(c_x<=this.config.width&&c_y<=this.config.height){
			that.move_stop();
		}
	},
	/*球体碰撞监听*/
	collide:function(){
		var y_angle=0-this.config.angle;
		var x_angle=180-this.config.angle;
		for(var i=0;i<ball_glo.collideE_all.length;i++){
			//取球之间的距离
			
			var c_x=Math.abs(this.config.thisball.centerLeft-ball_glo.collideE_all[i].centerLeft);
			var c_y=Math.abs(this.config.thisball.centerTop-ball_glo.collideE_all[i].centerTop);
			//console.log(c_x+"__"+c_y);
			
			if(c_x!=0&&this.config.thisball.collideTarget!=ball_glo.collideE_all[i].id){
				if(c_x<=this.config.width&&c_y<=this.config.height){
					/*记录碰撞目标ID，一面同一球体多次碰撞*/
					this.config.thisball.collideTarget=ball_glo.collideE_all[i].id;
					//console.log(this.config.thisball.collideTarget);
					if(c_x>c_y){
						//console.log(this.config.thisball.innerHTML+"X");
						this.config.angle=x_angle+Math.random()*20;
					}else if(c_x<c_y){
						//console.log(this.config.thisball.innerHTML+"Y");
						this.config.angle=y_angle+Math.random()*20;
					}else{
						//console.log(this.config.thisball.innerHTML+"YX");
					}
					
				}
			}
			
		}
	}
}
function b_extend(c,p){
	for(var i in p){
		c[i]=p[i];
	}
	return c;
}


window.addEventListener("load",function(){
	windowSize=getwin();
})
/*window.addEventListener("resize",function(){
	windowSize=getwin();
})*/
function getwin(){
	return {width:document.documentElement.clientWidth,height:document.documentElement.clientHeight}
}
//生成随机ID函数
function createCode(){
	var abc="abcdefghijklmnopqrstuvwxyz";
	var id=Math.ceil(Math.random()*1000)+abc[Math.floor(Math.random()*26)]+Math.ceil(Math.random()*100)+abc[Math.floor(Math.random()*26)]+abc[Math.floor(Math.random()*26)]+Math.ceil(Math.random()*10)+abc[Math.floor(Math.random()*26)];
	//console.log(abc[1]);
	return id;
}
//角度计算
function targetAngle(start,end){
	var diff_x = end.x - start.x,
		diff_y = end.y - start.y;
	//返回角度，不是弧度
	var ball360=350*Math.atan(diff_y/diff_x)/(2*Math.PI)+Math.random()*10;
	if(diff_x<0&&diff_y>0){
		ball360=360+ball360;
	}else if(diff_x>0&&diff_y<0){
		ball360=180+ball360;
	}else if(diff_x>0&&diff_y>0){
		ball360=180+ball360;
	}
	return ball360;

}
//写入localStorage
function setStor(name){
	if(window.localStorage["nameList"]&&window.localStorage["nameList"]!=""){
			window.localStorage["nameList"]+=","+name;
	}else{
			window.localStorage["nameList"]=name;
	}
}
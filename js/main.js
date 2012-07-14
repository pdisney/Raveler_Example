$(document).ready(function(){

var myprojects;

var selected_node_id;



var rgraph = new $jit.RGraph({
	injectInto:'infovis',
	
//	background:{
//		CanvasStyles:{
//			strokeStyle:'#555',
//			shadowBlur:5,
//			shadowColor:'#555'
//		}
//	},
	Node:{
		overridable:true,
		color:'#3FA452'
	},
	Edge:{
		overridable:true,
		color:'#808080'
	},
	interpolation:'linear',
	duration:2500,
	fps:30,
	levelDistance:200,
	onBeforeCompute:function(node){
		var html ="<h4>"+node.name+"</h4><b>Connections:</b>";
		html +="<ul>";
		node.eachAdjacency(function(adj){
			var child = adj.nodeTo;
			html +="<li>"+child.name+"</li>";
		});
		html +="</ul>";
		$jit.id('inner-details').innerHTML=html;
	},
	onCreateLabel:function(domElement,node){
//		domElement.innerHTML = node.name;
		var style = domElement.style;
		style.cursor ='pointer';
		style.fontSize="1.5em";
		style.color="#EEEEEE";
                style.padding="5px";
//                style.backgroundImage=node.data.src;
                style.border="solid 2px silver";
//                style.color="silver";
//                style.backgroundColor=""
                

                var newImg = document.createElement("img");
                newImg.src = node.data.src;//"./images/detail-icon-sm.png";
                //
                var newdiv=document.createElement("div");
                newdiv.innerHTML=node.name;
////                newImg.height = "50";
////                newImg.width = "150";
////                newImg.alt = "Click Me";
//                //  Create new link element
//                var newLink = document.createElement("a");
//                newLink.href = "/dir/signup.html";
//                //  Append new image into new link
//                newLink.appendChild(newImg);

                
                domElement.appendChild(newImg);
                domElement.appendChild(newdiv);
               
		
		domElement.onclick = function(){
			rgraph.onClick(node.id,{
			hideLabels:false});
		};
		
		domElement.onmouseover=function(){
			style.fontSize="1.9em";
			style.color="#FFFFFF";
		};
		
		domElement.onmouseout=function(){
			style.fontSize="1.5em";
			style.color="#EEEEEE";
		};
	},
	onPlaceLabel:function(domElement,node){
		var style = domElement.style;
		var left = parseInt(style.left);
		var w = domElement.offsetWidth;
		style.left = (left -w / 2) + "px";
		var top = parseInt(style.top);
		style.top=top-30 + 'px';
		
		$(domElement).bind("contextmenu",function(e){
			selected_node_id = this.id;
			selected_profile = this.id.replace("graph","");
			hideContextMenu();
			graphRightClick(e,selected_node_id);
			return false;
		});
	}

});

function rightClick(e){
	$('#context-menu').show();
	$('#context-menu').css("left",e.clientX+10+"px");
	$('#context-menu').css("display","inline-block");
	$('#context-menu').css("top",e.clientY+10+"px");
}

function hideContextMenu(){
	$('#context-menu').hide();
}

function graphRightClick(e,id){
	rightClick(e);
	$('#node-remove').show();
	$('#node-add').show();	
	$('#node-filter').show();
	
}

$('body').click(function(e){
	hideContextMenu();
	
});

$('#node-filter').click(function(e){
	if(selected_node_id =="center")
		return;
	var node=rgraph.graph.getNode(selected_node_id);
	if(!node)
		return;
		
	if(rgraph.root==selected_node_id){
		var centerId="center";
		if(rgraph.parent.id!='')
			centerId = rgraph.parent.id;
			
		rgraph.onClick(centerId,{hideLabels:false});
	}
	removeNode();
	
});

$('#node-details').click(function(e){
        var node=rgraph.graph.getNode(selected_node_id);
	window.open(node.data.url) ;
});


$('#node-add').click(function(e){
        alert("Adding a project is not implemented yet.")
});
$('#node-remove').click(function(e){
        alert("Removing a project is not implemented yet.")
});

function removeNode(){
	setTimeout(function(){
		rgraph.op.removeNode(selected_node_id,{
			type:'fade:con',
			duration:1000,
			fps:30,
			hideLabels:false
		});
		rgraph.labels.clearLabels();
	},0);
	rgraph.compute('end');

}


getProjects();
function getProjects(){
       $.ajax({
		async:false,
		type:"GET",
		dataType:"jsonp",
		url:"http://api.ravelry.com/projects/pdis/progress.json?key=cd6ffaf4e4a760ecfa70bc33c19f1fc804479e56",
		success:function(msg){
			myprojects= [
				{"id":"center",
				"name":msg.user.name + "'s Projects",
				"data":{"$dim":16,"url":msg.user.url,"src":""},
				"adjacencies":[]}]
			var i = 1;
			for(var y=0;y<msg.projects.length;y++){
                        var project = msg.projects[y];
                        var pic ="";
                        if(project.thumbnail!=null)
                            pic=project.thumbnail.src;
                            
                        myprojects[i]=
				{"id":project.name,
				"name":project.name,
				"data":{"$dim":16,"url":project.url,"src":pic},
				"adjacencies":[{"nodeTo":"center"}]};
				i++;
			}
			
			rgraph.loadJSON(myprojects,0);
			rgraph.refresh();
			rgraph.controller.onBeforeCompute(rgraph.graph.getNode(rgraph.root));
		},
		error:function(e,obj){
			alert(e.statusText);
		}
	});
}
//rgraph.loadJSON(myprojects,0);
//rgraph.refresh();
//rgraph.controller.onBeforeCompute(rgraph.graph.getNode(rgraph.root));
//rgraph.onClick(selected_node_id,{hideLabels:false});


});






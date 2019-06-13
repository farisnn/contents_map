var nodes = new vis.DataSet([
    {id:1, label: '問題',group:'problem'},
    {id:2, label: 'やりたいこと',group:'purpose'},
    {id:3, label: '解決方法',group:'solution'},
    {id:4, label: '検証',group:'verification'},
    {id:5, label: '問題2',group:'problem'}
  ]);

  // create an array with edges
  var edges = new vis.DataSet([
  
  ]);

  //Definition of logical-model
let logical_model = {
    nodes:['problem','purpose','solution','verification'],
    edges:[
        [0,1,0,1],
        [0,0,1,1],
        [1,0,1,1],
        [1,0,0,0]
    ],
    check_relation : function(from,to){
        return this.edges[this.nodes.indexOf(from)][this.nodes.indexOf(to)];
    }
}

  // create a network
  var container = document.getElementById('mynetwork');
  var data = {
    nodes: nodes,
    edges: edges
  };
  var options = {
      edges:{
        arrows:'to'
      },
      manipulation: {
    addNode: function (data, callback) {
      // filling in the popup DOM elements
      let dialoge = document.getElementById('add_node');
      dialoge.showModal();
      let ok_button = document.getElementById('add_node_ok');
      ok_button.onclick = function(){
        let name = document.getElementById('node_name').value;
        let group = document.getElementById('type_select').value;
        data = {label:name,group:group}
        document.getElementById('node_name').value='';
        callback(data);
        dialoge.close();
      }
    },
    editNode: function (data, callback) {
      let dialoge = document.getElementById('add_node');
      dialoge.showModal();
      let ok_button = document.getElementById('add_node_ok');
      document.getElementById('node_name').value=data.label;
      document.getElementById('type_select').value=data.group;

      ok_button.onclick = function(){
        let name = document.getElementById('node_name').value;
        let group = document.getElementById('type_select').value;
        data = {id:data.id,label:name,group:group}
        callback(data);
        name.value='';
        dialoge.close();
    }},

    addEdge: function (selected, callback) {
      if (logical_model.check_relation(data.nodes.get(selected.from).group,data.nodes.get(selected.to).group)==1) {
        callback(selected);
      }
    }
  }};


  var network = new vis.Network(container, data, options);

  //保存処理（ブラウザに）
  let save_button = document.getElementById('save');
  save_button.onclick = function(){
    let save_data = {
      nodes:data.nodes.get(),
      edges:data.edges.get()
    }
    let json_str = JSON.stringify(save_data);
    localStorage.setItem('graph_data',json_str);
  }

  //読み込み処理（ブラウザから）
  let load_buttoon = document.getElementById('load');
  load_buttoon.onclick = function(){
    let json_str = localStorage.getItem('graph_data');
    let load_data = JSON.parse(json_str);
    network.destroy();
    nodes = new vis.DataSet(load_data.nodes);
    edges = new vis.DataSet(load_data.edges);
    data={
      nodes:nodes,
      edges:edges
    }
    network = new vis.Network(container, data, options);
  }

  //ローカル保存処理
  let local_save_button = document.getElementById('save_local');
  local_save_button.onclick = function(){

    let save_data = {
      nodes:data.nodes.get(),
      edges:data.edges.get()
    }
    let json_str = JSON.stringify(save_data);
    let blob = new Blob([ json_str ], { "type" : "text/plain" });
    let link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = 'sampleText.txt'
    link.click()   



  }

  //ローカル読み込み処理
  let local_load_button = document.getElementById('load_local');
  local_load_button.onclick = function(){

    let file = document.getElementById('filebox');
    let file_name = file.files;
    let reader = new FileReader();

    reader.onload = function(){
      let data = reader.result;
      let load_data = JSON.parse(data);
    network.destroy();
    nodes = new vis.DataSet(load_data.nodes);
    edges = new vis.DataSet(load_data.edges);
    data={
      nodes:nodes,
      edges:edges
    }
    network = new vis.Network(container, data, options);
    }

    reader.readAsText(file_name[0]);



  }
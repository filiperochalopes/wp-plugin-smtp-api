jQuery(document).ready(function ($) {

  textarea = $("#json_textarea_config_menus");
  json_textarea = JSON.parse(textarea.text()) || null;
  hasStarted = false

  // pseudo setState
  updateJsonTextarea = temp => {
    textarea.text(JSON.stringify(temp))
    json_textarea = JSON.parse(textarea.text())
  }

  reWriteJson = () => {
    temp = json_textarea;

    console.log(temp)
    
    // Coloca todas as strings numericas para numeros
    temp.forEach( (e, i, a) => {
      a[i].id = parseInt(e.id)
      a[i].menu = parseInt(e.menu)
      a[i].level = parseInt(e.level)
      a[i].child_of = e.child_of ? parseInt(e.child_of) : null
      a[i].order = parseInt(e.order)
      a[i].orgao = parseInt(e.orgao)
      a[i].b_del = parseInt(e.b_del)
    })

    console.log(temp)

    // Verifica quantos level 1 existem e adciona id ao tempLevel1
    tempLevel1 = []
    temp.forEach( e => {
      if(e.level == 1) tempLevel1.push(e)
    })

    // Reordena os level 1 para em caso de troca Up e Down entre categorias
    tempLevel1.sort( function(a, b){
      if( a.order > b.order ) return 1
      if( a.order < b.order ) return -1
      return 0
    })

    // textarea.text(JSON.stringfy(temp))

    orderedTemp = []
    // Reordena seguindo a ordem level/order > children
    tempLevel1.forEach( e => {
      orderedTemp.push(e)
      orderedTemp = addChildrenInOrder(e.id, orderedTemp)
      console.log(orderedTemp)
    })

    updateJsonTextarea(orderedTemp)
  }

  addChildrenInOrder = (parentId, arr) => {
    console.log("called")

    temp = json_textarea
    tempChildren = []
    temp.forEach( (e, i, a) => {
      if(e.child_of == parentId){
        console.log("Adicionado inicialmente elemento" + e.nome + "nos filhos de " + parentId)
        tempChildren.push(e)
      }
    })

    // Reorganizar array com base na ordem
    tempChildren.sort( function(a, b){
      if( a.order > b.order ) return 1
      if( a.order < b.order ) return -1
      return 0
    })

    // Adiciona itens temporarios ao raiz
    tempChildren.forEach( e => arr.push(e) )
    console.log(tempChildren)

    // pesquisa se também tem algum filho desse que acabou de achar, caso não, pressegue, caso sim cama a própria função novamente
    tempChildren.forEach( e => {
      temp.forEach( el => {
        // Verifico se tem filhos desse item recem adicionado em TEMP
        if(el.child_of == e.id){
          console.log("HEY! SOU FILHO DO FILHO DE "+parentId+" SOU "+el.id)
          shouldAdd = true // Depois de perceber que esse loop sempre duplica os filhos > level 2 adicionei esse hack limitador, isso acontee pois logo no início da função ele já adiciona no tempChildren e no loop adiciona novamente evoluindo exponencialmente
          console.log("arr", arr)
          arr.forEach( elem => {
            if(elem.id == el.id) shouldAdd = false
          })
          if(shouldAdd) addChildrenInOrder(e.id, arr)
        }
      })
    })

    return arr
  }

  // Inicialização do gerenciador
  initItens = forceReWrite => {
    if(!hasStarted) reWriteJson()
    hasStarted = true

    if(forceReWrite) reWriteJson()

    $("#form_edit_menus").html("");
    
    // Não sei porque , mas só funcionou assim, não funciona chamando a variavel json_textarea criada.
    temp = JSON.parse(textarea.text());
    // console.log(temp)

    // Renderiza todos os itens do menu segundo banco de dados.
    temp.forEach( (e, i) => {
      if(!e.b_del){
        min_order = 1
        tempLevel1 = []
        temp.forEach( el => {
          if(el.level == 1){
            tempLevel1.push(el)
          }
        })

        // Reorganizar array com base na ordem
        tempLevel1.sort( function(a, b){
          if( a.order > b.order ) return 1
          if( a.order < b.order ) return -1
          return 0
        })
        
        min_order = tempLevel1[0].order;

      if(e.child_of == null && e.level == 1 && e.order > min_order){
        // Coloca o botão de adicionar item da categoria anterior
        lastElement = temp[i-1]
          if(lastElement.level == 1){
            lastElement.level = 2
            lastElement.child_of = lastElement.id
            lastElement.order = 0
          }
          $("#form_edit_menus").append(`
          <button type="button" class="addItem" data-level="${lastElement.level}" data-childOf="${lastElement.child_of}" data-menu="${global_menu}" data-order="${lastElement.order+1}"><i class="fas fa-plus"></i> Adicionar novo item</button>`)
      }
        $("#form_edit_menus").append(`
        <div data-level="${e.level}" data-childOf="${e.child_of}" data-id="${e.id}">
        <input type="hidden" name="menus[]" min="1" max="2" class="smallControlersInput menus" value="${e.menu}"/>
        <input type="hidden" name="level[]" min="1" max="4" class="smallControlersInput level" value="${e.level}"/>
        <input type="hidden" name="childOf[]" class="smallControlersInput child_of" value="${e.child_of}"/>
        <input type="hidden" name="order[]" class="smallControlersInput order" value="${e.order}"/>
        <input type="text" name="nome[]" class="nome" value="${e.nome}"/>
        <input type="text" name="src[]" class="src" placeholder="Link de destino" value="${e.src}"/>
        <button type="button" class="moveLeft"><i class="fas fa-arrow-left"></i></button>
        <button type="button" class="moveRight"><i class="fas fa-arrow-right"></i></button>
        <button type="button" class="moveUp"><i class="fas fa-arrow-up"></i></button>
        <button type="button" class="moveDown"><i class="fas fa-arrow-down"></i></button>
                        <select name="orgao[]" id="select_${e.id}">
                            <option value="2">INEMA/SEMA</option>
                            <option value="0">INEMA</option>
                            <option value="1">SEMA</option>
                        </select> 
        <button type="button" class="delete" data-id="${e.id}"><i class="fas fa-times"></i></button>
        </div>`)

        if(i == temp.length - 1){
          // Adiciona demais itens
          lastElement = temp[i]
          if(lastElement.level == 1){
            lastElement.level = 2 
            lastElement.child_of = lastElement.id
            lastElement.order = 0
          }
          $("#form_edit_menus").append(`
          <button type="button" class="addItem" data-level="${lastElement.level}" data-childOf="${lastElement.child_of}" data-menu="${global_menu}" data-order="${lastElement.order+1}"><i class="fas fa-plus"></i> Adicionar novo item</button>`)
        }
      }

      // Atualiza campo de select
      $("#select_"+e.id).val(e.orgao)
    })
    
    $("#form_edit_menus").append(`
    <br/><br/><br/>
    <button type="button" class="addCat" data-menu="${global_menu}"><i class="fas fa-plus"></i> Adicionar nova categoria</button>`)
        
    $("#form_edit_menus").append(`<br><br><input type="submit" id="atualizarMenu" value="Atualizar" class="button button-primary" />`)
  }

  initItens();

  interval = null;

  const alert = (b, t) => {
    clearTimeout(interval)
    $(".alert").show();
    $(".alert").removeClass("success");
    $(".alert").removeClass("error");
    if(b){
      $(".alert").addClass("success");
      $(".alert").text(t);
    }else{
      $(".alert").addClass("error");
      $(".alert").text(t);      
    }

    interval = setTimeout( function(){
      $(".alert").hide()
    }, 3000)
  }

  changeLevel = (parent, levelVal, action) => {
    console.log("changeLevel")
    if(action == "add"){
      newLevel = levelVal + 1
    }else{
      newLevel = levelVal - 1
    }

    // Atualiza JSON
    child_of = parent.find("input.child_of").val()
    order = parent.find("input.order").val()
    temp = json_textarea;
    temp.forEach( (e, i, a) => {
      console.log(e.child_of, child_of, e.order, order, e.nome)
      if(e.child_of == parseInt(child_of) && e.order == parseInt(order)){
        // set level
        a[i].level = newLevel

        // reParent, para isso verifica o level do anterior, se for igual ao novo quer dizer que o children dele deve ser o mesmo, caso o level do item anterior seja um a menos ele é o próprio pai, caso o level seja um a mais busco os anteriores até achar o pai
        prevItemLevel = parseInt(parent.prev().attr("data-level"));
        prevItemChildOf = parent.prev().attr("data-childOf");
        prevItemId = parent.prev().attr("data-id");
        if(prevItemLevel == parseInt(e.level)){
          a[i].child_of = prevItemChildOf
          console.log("igual ao pai", prevItemChildOf)
        }else if(prevItemLevel < parseInt(e.level)){
          a[i].child_of = prevItemId
          console.log("novo filho", prevItemId)
        }else{
          lookForPrev = parent.prev();
          // Hack para procurar de forma regressiva um pai que tenha o mesmo levl do novo level
          for (let index = 0; index < temp.length; index++) {
            if(parseInt(lookForPrev.attr("data-level")) == newLevel){
              a[i].child_of = lookForPrev.attr("data-childOf")
              break
            }            
            lookForPrev = lookForPrev.prev()
          }
        }

        // Verifica se o item atual tem algum filho e coloca ele como filho de meu pai caso o level seja o mesmo.
        temp.forEach( (el, idx, arr) => {
          if(el.child_of == e.id){
            if(el.level == e.level){
              arr[idx].child_of = e.child_of
            }else if((parseInt(el.level) + 1) > parseInt(e.level)){
              // Verifica se algum filho acabou ficando para trás com um level a mais
              arr[idx].level= e.level + 1
            }
          }
        })

        // reorder, primeiro verificao ultimo item desse child_of
        temp_child_of = [];
        newOrder = 1;
        temp.forEach( (el, idx, arr) => {
          if(newLevel == el.level && e.child_of == el.child_of){
            // temp_child_of.push(e)
            arr[idx].order = newOrder
            newOrder++
          }
        })
      }
    })

    // Configuração de número máximo de levels conforme requisitado
    maxLevel = 4;
    // Reorganizar todos os itens de mesmo level
    newOrder = 1;
    temp.forEach( (el, idx, arr) => {
      for (let index = 0; index < maxLevel; index++) {
        // console.log(el.nome, el.level, levelVal, el.child_of, child_of)
        if(el.level == index && el.child_of == child_of){
          arr[idx].order = newOrder
          newOrder++
          console.log(el)
        }
      }
    })

    textarea.text(JSON.stringify(temp));
    initItens();
  }

  changeOrder = (parent, orderVal, direction) => {
    if(direction == "up"){
      newOrder = orderVal - 1
    }else{
      newOrder = orderVal + 1
    }

    id = parent.attr("data-id");
    child_of = parent.attr("data-childOf") == "null" ? null : parent.attr("data-childOf");
    temp = json_textarea
    temp.forEach( (e, i, a) => {
      console.log("child_of", child_of)
      console.log("checkChildStatm", e.child_of == child_of, !child_of)
      console.log("if else", e.order == newOrder, (e.child_of == child_of || !child_of) )
      if(e.order == newOrder && (e.child_of == child_of || !child_of) ){
        // Dá nova ordem à quele que trocou de lugar com ele
        a[i].order = orderVal
      }
      if(e.id == id){
        // Altera a ordem local
        a[i].order = newOrder
      }
    })

    updateJsonTextarea(temp)
    initItens(true)
  }
  
  changeName = ( id, val ) => {
    temp = JSON.parse(textarea.text())
    temp.forEach( (e, i, a) => {
      if(e.id == id){
        a[i].nome = val
      }
    })

    updateJsonTextarea(temp)
  }

  changeSrc = ( id, val ) => {
    temp = JSON.parse(textarea.text())
    temp.forEach( (e, i, a) => {
      if(e.id == id){
        a[i].src = val
      }
    })

    updateJsonTextarea(temp)
  }

  changeOrgao = ( id, val ) => {
    temp = JSON.parse(textarea.text())
    temp.forEach( (e, i, a) => {
      if(e.id == id){
        a[i].orgao = parseInt(val)
      }
    })
    
    updateJsonTextarea(temp)
  }

  addItem = item => {
    temp = json_textarea;
    temp.push(item)
    console.log(item)
    initItens(true)
  }

  remItem = id => {
    temp = JSON.parse(textarea.text())

    // Faz varredura para colocar todos os filhos inclusos
    tempChildren = []

    checkLoop = id => {
      temp.forEach( e => {
        if(e.id == id) tempChildren.push(e)
        if(e.child_of == id){
          tempChildren.push(e)
          checkLoop(e.id)
        }
      })
    }

    checkLoop(id)
    console.log(tempChildren)

    temp.forEach( (e, i, a) => {
      tempChildren.forEach( (el, idx, arr) => {
        if(e.id == el.id){
          if(e.b_new){
            // Excluir item totalmente, pois ele é novo e ainda nem foi para o banco de dados
            a.splice(i, 1);
          }else{
            a[i].b_del = 1
          }
        }
      })
    })

    console.log(temp)

    updateJsonTextarea(temp)
    initItens();
  }

  lastId = $("#auto_increment").val()

  newId = () => {
    lastId++
    return lastId
  }

  /* ---------- EVENTS ---------- */

  // MOVER UM LEVEL À ESQUERDA
  $("#form_edit_menus").on("click", ".moveLeft", function(){
    // Verifica se tem algum outro 1 no grupo
    parent = $(this).parent();
    levelVal = parseInt(parent.find("input.level").val());
    if(levelVal == 2){
      alert( false , "Você não pode colocar dois títulos de sessão em um mesmo menu");
      return false
    }

    changeLevel(parent, levelVal, "rem")

  })

  // MOVER UM LEVEL À DIREITA
  $("#form_edit_menus").on("click", ".moveRight", function(){
    // Verifica se tem algum outro 1 no grupo
    parent = $(this).parent();
    levelVal = parseInt(parent.find("input.level").val());
    if(parent.attr("data-level") == "1"){
      alert(false, "Um item de categoria não pode ser movido")
      return false
    }
    if(levelVal == 4){
      alert( false , "Você atingiu o máximo level");
      return false
    }
    if(parent.find(".order").val() == "1"){
      alert(false, "Um item no topo da lista não pode ser movido de nível")
      return false
    }
    if(parseInt(parent.prev().attr("data-level")) < levelVal){
      alert(false, "O item filho não pode ter dois leveis maior que o item pai")
      return false
    }

    changeLevel(parent, levelVal, "add")
  })

  // ADICIONAR ITEM DENTRO DE CATEGORIA PRÉVIA
  $("#form_edit_menus").on("click", ".addItem", function(){
    menu = $(this).attr("data-menu")
    level = $(this).attr("data-level")
    child_of = $(this).attr("data-childOf")
    order = $(this).attr("data-order") // Note que no próprio dataset já foi adicionado +1
    temp = json_textarea;

    addItem({
      id: newId(),
      menu,
      level,
      child_of,
      order,
      nome: "Nome do novo item",
      src: "#",
      orgao: 2,
      b_del: 0,
      b_new: 1
    })

  })

  // ADICIONAR CATEGORIA
  $("#form_edit_menus").on("click", ".addCat", function(){
    menu = $(this).attr("data-menu")
    temp = json_textarea;
    
    tempCategorias = []
    temp.forEach( e => {
      if(e.level == 1) tempCategorias.push(e)
    })

    addItem({
      id: newId(),
      menu,
      level: 1,
      child_of: null,
      order: tempCategorias.length + 1,
      nome: "Nome da nova categoria",
      src: null,
      orgao: 2,
      b_del: 0,
      b_new: 1
    })

  })

  // ALTERAR NOME
  $("#form_edit_menus").on("keyup", ".nome", function(){
    parent = $(this).parent();
    id = parent.attr("data-id")
    val = $(this).val()

    changeName(id, val)
  })

  // ALTERAR SRC
  $("#form_edit_menus").on("keyup", ".src", function(){
    parent = $(this).parent();
    id = parent.attr("data-id")
    val = $(this).val()

    changeSrc(id, val)
  })

  // ALTERAR ORGAO
  $("#form_edit_menus").on("change", "select", function(){
    parent = $(this).parent();
    id = parent.attr("data-id")
    val = $(this).val()

    changeOrgao(id, val)
  })

  // EXCLUIR ITEM, se era novo remove mesmo, se era antigo apenas altera o b_del  
  $("#form_edit_menus").on("click", ".delete", function(){
    parent = $(this).parent();
    id = $(this).attr("data-id")

    hasChildren = false
    temp = json_textarea
    temp.forEach( e => {
      // Verifica se esse item tem filhos
      if(e.child_of == id){
        hasChildren = true
      }
    })

    if(hasChildren){
      if(confirm("Tem certeza que deseja excluir esse item e seus filhos?")){
        remItem(id)
      }else{
        return false
      }
    }

    remItem(id)
  })

  // MOVER ORDEM PARA CIMA
  $("#form_edit_menus").on("click", ".moveUp", function(){
    // Verifica se tem algum outro 1 no grupo
    parent = $(this).parent();
    orderVal = parseInt(parent.find("input.order").val());
    child_of = parseInt(parent.attr("data-childOf"));

    // Verifica a ordem e os ites que são irmãos
    temp = json_textarea;
    tempBrothers = []
    temp.forEach( e => {
      if(e.child_of && e.child_of == child_of){
        tempBrothers.push(e)
      }
      // Para categorias, que não é filho de ninguem
      if(!child_of && !e.child_of){
        tempBrothers.push(e)
      }
    })

    // Reorganizar array com base na ordem
    tempBrothers.sort( function(a, b){
      if( a.order > b.order ) return 1
      if( a.order < b.order ) return -1
      return 0
    })

    console.log("tempBrothers", tempBrothers);
    // console.log(tempBrothers[tempBrothers.length-1].order == orderVal);

    // Verifica se ele é o primeiro item da lista
    if(tempBrothers[0].order == orderVal){
      alert(false, "Esse já é o primeiro item da lista")
      return false
    }

    changeOrder(parent, orderVal, "up")
  })

  // MOVER ORDEM PARA BAIXO
  $("#form_edit_menus").on("click", ".moveDown", function(){
    // Verifica se tem algum outro 1 no grupo
    parent = $(this).parent();
    orderVal = parseInt(parent.find("input.order").val());
    child_of = parseInt(parent.attr("data-childOf"));

    // Verifica a ordem e os ites que são irmãos
    temp = json_textarea;
    tempBrothers = []
    temp.forEach( e => {
      if(e.child_of && e.child_of == child_of){
        tempBrothers.push(e)
      }
      // Para categorias, que não é filho de ninguem
      if(!child_of && !e.child_of){
        tempBrothers.push(e)
      }
    })

    // Reorganizar array com base na ordem
    tempBrothers.sort( function(a, b){
      if( a.order > b.order ) return 1
      if( a.order < b.order ) return -1
      return 0
    })

    console.log("tempBrothers", tempBrothers);
    // console.log(tempBrothers[tempBrothers.length-1].order == orderVal);

    // Verifica se ele é o primeiro item da lista
    if(tempBrothers[tempBrothers.length - 1].order == orderVal){
      alert(false, "Esse já é o último item da lista")
      return false
    }

    changeOrder(parent, orderVal, "down")
  })


  // ATUALIZAR BANCO DE DADOS
  $("#form_edit_menus").submit( function(ev){
    ev.preventDefault()
    alert(true, "Carregando...")
    ajaxurl = $(this).attr("action")
    console.log(JSON.parse(textarea.text()))
    $.ajax({
			type : "POST",
			url : ajaxurl,
			data : { json : JSON.parse(textarea.text()) },
			success : function(data) { 
        console.log(data)
        alert(true, "Seu menu foi reconfigurado com sucesso")
      },
      error : function(e) {
        console.log("ERROR" + e)
      }
		});
  })  

})
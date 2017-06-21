// https://www.facebook.com/groups/startupco/permalink/1359283507442442/
function fetchData () {
  var postContainer = document.querySelector('.fbUserContent._5pcr')

  var commentsContainer = postContainer.querySelector('.commentable_item')

  var comments = commentsContainer.querySelectorAll('[role=article]')

  var empresas = []

  var limpiarNombre = n => {
    if (n.substr(0, 4) === 'www.') {
      return n.substr(4, n.length)
    }
    return decodeURI(n)
  }

  // itera sobre los comentarios
  var comment, contentContainer, link, empresa, temp, url
  for (var i = 0; comment = comments[i]; i++) {
    contentContainer = comment.querySelector('.UFICommentContent')
    contentBody = contentContainer.querySelector('.UFICommentBody')
    link = contentBody.querySelector('a')
    if (link && link.childNodes.length === 1) {
      empresa = {}
      if (link.text.indexOf('.') !== -1) {
        var href = link.text.substr(0, 4) === 'http'
          ? link.text
          : 'https://' + link.text
        try {
          url = new URL(href)
          if (url.hostname === 'facebook.com'
            || url.hostname === 'www.facebook.com'
            || url.hostname === 'm.facebook.com'
            || url.hostname === 'l.facebook.com') {
            // a menos de que sea Mark, es una pagina de Facebook de una empresa
            var parts = url.pathname.split('/')
            if (parts[1]) {
              empresa.nombre = limpiarNombre(parts[1])
            } else {
              empresa.nombre = '---' // algo ocurrio o.O, mal link
            }
          } else {
            // es una pagina web de una empresa
            empresa.nombre = limpiarNombre(url.hostname)
          }
        } catch (e) {
          // si no es una URL valida probablemente sea el nombre de la empresa
          empresa.nombre = limpiarNombre(link.text)
        }
      } else {
        empresa.nombre = limpiarNombre(link.text)
      }
      empresa.fanpageUrl = link.href 
      temp = contentContainer.querySelector('.UFICommentActorName')
      empresa.usuarioNombre = temp.text
      empresa.usuarioUrl = temp.href
      empresas.push(empresa)
    }
  }

  // remover duplicados
  var empresasNoDup = []
  var repetido = false
  for (var i = 0; empresa = empresas[i]; i++) {
    for (var j = 0; empresaComp = empresasNoDup[j]; j++) {
      if (empresa.nombre === empresaComp.nombre) { // no es la misma empresa
        repetido = true
      }
    }
    if (!repetido) {
      empresasNoDup.push(empresa)
    }
    repetido = false
  }

  // se organiza en orden alfabetico

  empresasNoDupOrd = empresasNoDup.sort((a, b) => {
    if (a.nombre < b.nombre) return -1
    if (a.nombre > b.nombre) return 1
    return 0
  })

  // pretty print :D (para Facebook)

  // var strFace = ''

  // for (var i = 0, empresa; empresa = empresasNoDupOrd[i]; i++) {
  //   strFace += '\n\n' + (i + 1) + '. ---'
  //       + '\nnombre: ' + empresa.nombre
  //       + '\nfanpageUrl: ' + empresa.fanpageUrl
  //       + '\nusuarioNombre: ' + empresa.usuarioNombre
  //       + '\nusuarioUrl: ' + empresa.usuarioUrl
  // }

  // pretty print :D (para Github)

  var strGithub = ''

  for (var i = 0, empresa; empresa = empresasNoDupOrd[i]; i++) {
    strGithub += '\n\n## ' + (i + 1) + '. ' + empresa.nombre
        + '\n- fanpageUrl: [' + empresa.fanpageUrl + '](' + empresa.fanpageUrl + ')'
        + '\n- usuarioNombre: ' + empresa.usuarioNombre
        + '\n- usuarioUrl: [' + empresa.usuarioUrl + '](' + empresa.usuarioUrl + ')'
  }

  // console.log(str + strFace)
  console.log(str + strGithub)
  console.log(JSON.stringify(empresasNoDupOrd, null, 2))
}

fetchData()

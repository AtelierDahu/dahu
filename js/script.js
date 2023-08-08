;(function() {
  const getId = element =>
    element.getAttribute && element.getAttribute('data-sabo-id')
  const getLastSaboId = document =>
    [...document.querySelectorAll(`*[data-sabo-id]`)]
      .map(getId)
      .map(Number)
      .filter(_ => !isNaN(_))
      .sort((a, b) => (a > b ? 1 : -1))
      .pop()
  function canUseWebP() {
    var elem = document.createElement('canvas')
    if (elem.getContext && elem.getContext('2d')) {
      // was able or not to get WebP representation
      return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0
    }
    // very old browser like IE 8, canvas not supported
    return false
  }
  // BACKGROUND management
  const $ = window.$
  const backgrounds = [
    'images/IMG-6213.jpg',
    'images/IMG_20180707_173805.jpg',
    'images/IMG_2876-2.jpg',
    'images/IMG_2699.jpg',
    'images/IMG_2612.jpg',
    'images/IMG_0656.jpg',
    'images/20170309_104708.jpg',
    'images/IMG_2568.jpg',
    'images/IMG_1521.jpg',
    'images/IMG_1528.jpg',
  ]
  const bgToShow =
    backgrounds[Math.round(Math.random() * (backgrounds.length - 1))]
  if (bgToShow.match(/\.(jpg)$/)) {
    $('.showroom .bg').fadeOut(0)
    $('.showroom .bg').css(
      'backgroundImage',
      `url(${canUseWebP() ? bgToShow.replace('jpg', 'webp') : bgToShow})`
    )
    $('.showroom .bg').fadeIn(500)
  } else {
    $('.showroom .bg').append(
      `<video src="${bgToShow}" autoplay muted loop></video>`
    )
  }

  const showroomTimeout = setTimeout(() => $('.showroom').fadeOut(), 5000)
  $('.showroom').click(() => {
    $('.showroom').fadeOut()
    clearTimeout(showroomTimeout)
  })

  const showRow = name => {
    cleanSlides()
    if (!$(`.content > .row.${name}`).is(':visible')) {
      $('.content > .row').fadeOut(0)
      $(`.content > .row.${name}`)
        .stop()
        .fadeIn()
      cleanSlideButton()
    }
    const text =
      name === 'contact'
        ? $(`.content > .row.${name} > .content-text`)
        : $(`.content > .row.${name} > .slides > .content-text`)
    setTextInMenu(text)
  }

  // REALISATION
  let reaTransitions = []
  const showRea = filter => {
    reaTransitions.forEach(_ => clearTimeout(_))
    reaTransitions = []
    $(filter).each((i, rea) => {
      reaTransitions.push(
        setTimeout(
          () =>
            $(rea)
              .stop()
              .fadeIn(),
          0
        )
      )
    })
  }

  const menuButtonOpen = {}
  const toggleMenu = (menu, onlyClose) => {
    const isOpen = menuButtonOpen[menu]
    if (onlyClose && !isOpen) return
    let sign1 = isOpen ? '-' : '+'
    let sign2 = isOpen ? '+' : '-'
    $(`.menu-button.${menu}`).html(
      $(`.menu-button.${menu}`)
        .html()
        .replace(sign1, sign2)
    )
    $(`.menu-sub.${menu}`).toggle()
    if (sign2 === '+') {
      $(`.menu-sub.${menu} span.active`).removeClass('active')
    }
    menuButtonOpen[menu] = !isOpen
    return sign2
  }
  $('.menu-button.realisation').click(function() {
    showRow('realisation')
    toggleMenu('atelier', true)
    if (toggleMenu('realisation') === '+') {
      showRea('.rea', 0)
    }
  })

  const cleanTextInMenu = () => {
    const menuText = $('.menu .content-text')
    const bind = menuText.attr('ob-bind')
    if (bind) {
      $('.' + bind)
        .removeClass(bind)
        .html(menuText.html())
      menuText.removeAttr('ob-bind')
    }
    menuText.html('')
    return menuText
  }

  const setTextInMenu = fromElement => {
    const id = 'c' + Date.now()
    const saboShadowId = fromElement.attr('data-sabo-id')
    fromElement.addClass(id)
    const textInMenu = cleanTextInMenu()
    textInMenu
      .attr('ob-bind', id)
      .attr('data-sabo-shadow-id', saboShadowId)
      .html(fromElement.html())
  }

  const setTextInSlide = (slide, text) => {
    const slideContainer = slide.parents('.slides')
    if (!slideContainer.children('.content-text').length) {
      slideContainer.append(text)
    }
  }

  const cleanSlides = () => {
    $('.slides')
      .fadeOut(300)
      .each(() => {
        //setTimeout(() => move_in_galery($(slide), 0, 0, true), 200)
      })
    cleanTextInMenu()
    cleanSlideButton()
  }

  const cleanSlideButton = () => {
    $('.num-button-container .num-button').each((index, elem) => {
      const bind = $(elem).attr('ob-bind')
      $('.' + bind).removeClass(bind)
      $(elem).remove()
    })
    $('.num-button-container').html('')
  }

  const initSlideButton = slide => {
    cleanSlideButton()
    slide.find('.slide').each((index, elem) => {
      const num = (Date.now() * Math.random()).toFixed(0)
      const id = 't' + num
      $(elem).addClass(id)
      $('.num-button-container').append(
        `<div class="num-button ${index === 0 ? 'current' : ''}">${index +
          1}</div>`
      )
      const attrs = [
        ['data-sabo-id', getLastSaboId(document) + 1],
        ['data-sabo-editable', true],
        ['data-sabo-clone', 'cloneSlideButton'],
        ['data-sabo-remove', 'removeSlideButton'],
        ['ob-duplicable', 'refreshSlideButton'],
        ['ob-bind', id],
      ]
      const button = $(`.num-button`).last()
      attrs.forEach(([key, value]) => button.attr(key, value))
      button.click(() => move_in_galery(slide, 0, index))
    })
  }

  window.refreshSlideButton = (num, duplicate) => {
    const img = $('.' + $(num).attr('ob-bind'))
    const slides = img.parents('.slides')
    const index = img.index()
    if (duplicate) {
      img.clone().insertAfter(img)
    } else {
      img.remove()
    }
    setTimeout(() => {
      initSlideButton(slides)
      move_in_galery(slides, 0, index)
    }, 200)
  }

  window.cloneSlideButton = (element, refreshSaboElements) => {
    const img = $('.' + $(element).attr('ob-bind'))
    const slides = img.parents('.slides')
    const index = img.index()
    const clone = img.clone()

    clone.insertAfter(img)

    setTimeout(() => {
      initSlideButton(slides)
      move_in_galery(slides, 0, index)
      refreshSaboElements()
    }, 200)

    return {
      addedNodes: [clone.get(0)],
      removedNodes: [element],
    }
  }

  window.removeSlideButton = element => {
    const img = $('.' + $(element).attr('ob-bind'))
    const slides = img.parents('.slides')
    const index = img.index()

    setTimeout(() => {
      initSlideButton(slides)
      move_in_galery(slides, 0, index)
    }, 200)

    return {
      removedNodes: [img.get(0)],
    }
  }

  $('.menu-sub.realisation span').click(function() {
    const filter = `data-filter="${$(this).attr('data-filter')}"`
    $(`.rea`)
      .stop()
      .fadeOut(0)
    showRea(`.rea[${filter}]`)
    $('.menu-sub.realisation span.active').removeClass('active')
    $(this).addClass('active')
    cleanSlides()
  })

  $('.menu-button.atelier').click(function() {
    toggleMenu('realisation', true)
    toggleMenu('atelier')
  })

  $('.menu-sub.atelier span').each(function() {
    const el = $(this)
    const page = el.attr('data-page')

    el.click(() => {
      showRow(page)
      const slide = $(`.row.${page} .slides`)
      slide.fadeIn()
      $('.menu-sub.atelier span.active').removeClass('active')
      $(this).addClass('active')
      initSlideButton(slide)
      move_in_galery(slide, 0, 0)
    })
  })

  $('.menu-button.contact').click(() => {
    showRow('contact')
    toggleMenu('realisation', true)
    toggleMenu('atelier', true)
    const video = $('.row.contact video').get(0)
    video.currentTime = 0
    video.play()
  })

  /** GALERY */
  const prepare_neighbours = function(fsi, index) {
    let indexNext = index + 1
    let indexPrev = index - 1
    if (indexNext > fsi.length - 1) {
      indexNext = 0
    }
    if (indexPrev < 0) {
      indexPrev = fsi.length - 1
    }
    const next = $(fsi.get(indexNext))
    const prev = $(fsi.get(indexPrev))

    if (next.hasClass('prev')) {
      next.addClass('no-transition')
    }
    if (prev.hasClass('next')) {
      prev.addClass('no-transition')
    }
    next.addClass('next').removeClass('prev')
    prev.addClass('prev').removeClass('next')

    fsi.each((i, img) => {
      if ([index, indexNext, indexPrev].indexOf(i) === -1) {
        $(img)
          .removeClass('current')
          .addClass('next')
      }
    })
    setTimeout(() => {
      if (next.hasClass('no-transition')) {
        next.removeClass('no-transition')
      }
      if (prev.hasClass('no-transition')) {
        prev.removeClass('no-transition')
      }
    })
  }

  const move_in_galery = function(slides, relative, absolute, noText) {
    // get index
    const old = slides.find('.slide.current')
    const oldVideo = old.find('video')
    let index = absolute !== undefined ? absolute : old.index() + relative
    const fsi = slides.find('.slide')

    if (index > fsi.length - 1) {
      index = 0
    } else if (index < 0) {
      index = fsi.length - 1
    }

    old.removeClass('current')

    if (oldVideo.length) {
      oldVideo.get(0).pause()
    }

    prepare_neighbours(fsi, index)

    const current = $(fsi.get(index))
    const currentVideo = current.find('video')
    current
      .removeClass('next')
      .removeClass('prev')
      .addClass('current')

    if (currentVideo.length) {
      currentVideo.get(0).play()
    }

    const currentText = current.find('.content-text')
    if (!noText && currentText.length) {
      if ($('.mobile-menu').css('display') === 'block') {
        setTextInSlide(current, currentText)
      } else {
        setTextInMenu(currentText)
      }
    }
    $('.num-button.current').removeClass('current')
    $(
      `.num-button[ob-bind="${Array.from(
        (current.get(0) || { classList: [] }).classList
      )
        .filter(_ => _[0] === 't')
        .pop()}"]`
    ).addClass('current')
  }

  /**
   * END GALERY
   */

  function placeLogo() {
    const blackLogo =
      window.screen.availWidth > 576
        ? $($('.main.container .logo').get(1))
        : $($('.main.container .logo').get(0))
    const logoBlackOffset = blackLogo.offset()
    $('.showroom .logo').css({
      top: logoBlackOffset.top - scrollY,
      left: logoBlackOffset.left,
      display: 'block',
    })
    $('.showroom .logo img').css('width', blackLogo.width() + 'px')
  }

  $('.rea').click(function() {
    const rea = $(this)
    if (!rea.find('.slides').is(':visible')) {
      rea.find('.slides').fadeIn()
      move_in_galery(rea, 0, 0)
      setTextInMenu(rea.find('.description'))
      initSlideButton(rea)
      rea
        .find('.slide img')
        .get()
        .forEach(
          img =>
            !img.getAttribute('src') && (img.src = img.getAttribute('data-img'))
        )
    }
  })

  $('.slides').each((i, slides) => {
    const rea = $(slides)
    rea.find('a.left').click(() => move_in_galery(rea, -1))
    rea.find('a.right').click(() => move_in_galery(rea, +1))
    rea.find('.slide').addClass('next')
  })

  $('.slides').fadeOut(0)

  $('.logo').click(() => {
    showRow('realisation')
    showRea('.rea', 0)
    toggleMenu('atelier', true)
    toggleMenu('realisation', true)
  })
  cleanTextInMenu()

  setInterval(placeLogo, 100)
  placeLogo()
  $('.showroom .logo').fadeOut(0)
  $('.showroom .logo').fadeIn(500)

  if (
    location.href.match(
      /(octoboot\.ovh|sabo.simple-acces.fr\/admin\/dahu\/sandbox)/
    )
  ) {
    $('.slides .bt').hide()
  }

  window.octoboot_before_save = done => {
    $('.showroom').fadeIn(0)
    $('.showroom video').remove()
    $('.showroom').css('backgroundImage', '')
    showRow('realisation')
    showRea('.rea', 0)
    toggleMenu('atelier', true)
    toggleMenu('realisation', true)
    $('.slides .bt').show()
    setTimeout(done, 1000)
  }

  window.sabo_plugins = [
    {
      name: 'Ajouter / modifier un projet',
      icon: 'mdi-account-multiple-plus',
      type: 'formList',
      listForms() {
        if ($('.slides:visible').length) {
          cleanSlides()
        }
        const reas = Array.from(document.querySelectorAll('.rea'))
        return reas.map(_ => {
          const rea = $(_)
          const title = rea
            .find('.rea-overlay')
            .text()
            .trim()
          const vignette = rea.find('div > img').attr('src')
          const galerie = rea
            .find('.slides-container img')
            .get()
            .map(_ => $(_).attr('src'))
          const subtitle = rea
            .find('.description h5')
            .text()
            .trim()
          const description = rea
            .find('.fixed-text p')
            .get()
            .map(_ => _.innerHTML.trim().replace(/\s{2,}/g, ' '))

          const cats = {
            rea: 'architecture',
            ins: 'installation',
            mob: 'mobilier',
          }
          const categorie = cats[rea.data('filter')]

          return {
            title,
            image: vignette,
            dom: rea.get(0),
            fields: {
              categorie: {
                type: 'select',
                value: categorie,
                items: ['architecture', 'mobilier', 'installation'],
                order: 0,
              },
              'titre vignette (et sous titre projet)': {
                type: 'input',
                value: title,
                order: 1,
              },
              vignette: {
                type: 'image',
                multiple: false,
                value: [vignette],
                order: 2,
              },
              'titre projet': {
                type: 'input',
                value: subtitle,
                order: 3,
              },
              galerie: {
                type: 'image',
                multiple: true,
                value: galerie,
                order: 4,
              },
              'description (ligne 1)': {
                type: 'textarea',
                value: description[0],
                order: 5,
              },
              'description (ligne 2)': {
                type: 'textarea',
                value: description[1],
                order: 6,
              },
              'description (ligne 3)': {
                type: 'textarea',
                value: description[2],
                order: 7,
              },
            },
          }
        })
      },
      removeForm(form) {
        form.dom.remove()
        return [form.dom.getAttribute('data-sabo-id')]
      },
      addForm(form) {
        $('.row.realisation').prepend(`<div class="col-sm-4 rea">
            <div>
                <div class="rea-overlay"></div>
                <img src="" />
                <div class="slides" style="display:none">
                    <a class="bt left"></a>
                    <a class="bt right"></a>
                    <div class="slides-container"></div>
                    <div class="num-button-container"></div>
                    <div class="description">
                        <h5></h5>
                        <p style="font-size: 16px;"></p>
                        <div class="fixed-text">
                          <p></p>
                          <p></p>
                          <p></p>
                        </div>
                    </div>
                </div>
            </div>
          </div>`)
        form.dom = $('.row.realisation .rea').get(0)
        $('.rea').click(function() {
          const rea = $(this)
          if (!rea.find('.slides').is(':visible')) {
            rea.find('.slides').fadeIn()
            setTextInMenu(rea.find('.description'))
            initSlideButton(rea)
          }
        })

        $('.slides').each((i, slides) => {
          const rea = $(slides)
          rea.find('a.left').click(() => move_in_galery(rea, -1))
          rea.find('a.right').click(() => move_in_galery(rea, +1))
        })
        return [form.dom]
      },
      updateField(form, key, value) {
        const dom = $(form.dom)
        const descNum = (key.match(/description \(ligne (\d+)\)/) || [])[1]
        const galerie = dom.find('.slides-container img')
        const cats = {
          mobilier: 'mob',
          installation: 'ins',
          architecture: 'rea',
        }

        switch (key) {
          case 'titre vignette (et sous titre projet)':
            return [
              dom
                .find('.rea-overlay')
                .text(value)
                .attr('data-sabo-id'),
              dom
                .find('.description > :nth-child(2)')
                .text(value)
                .attr('data-sabo-id'),
            ]

          case 'titre projet':
            return [
              dom
                .find('.description > :nth-child(1)')
                .text(value)
                .attr('data-sabo-id'),
            ]

          case 'description (ligne 1)':
          case 'description (ligne 2)':
          case 'description (ligne 3)':
            return [
              dom
                .find(`.fixed-text > :nth-child(${descNum})`)
                .html(value)
                .attr('data-sabo-id'),
            ]

          case 'vignette':
            return [
              dom
                .find('> div > img')
                .attr('src', value)
                .attr('data-sabo-id'),
            ]

          case 'galerie':
            const modifiedIds = []
            for (let i = 0; i < Math.max(value.length, galerie.length); i++) {
              if (
                galerie[i] &&
                value[i] &&
                $(galerie[i]).attr('src') !== value[i]
              ) {
                //replace
                $(galerie[i]).attr('src', value[i])
                modifiedIds.push(
                  $(galerie[i])
                    .attr('src', value[i])
                    .attr('data-sabo-id')
                )
              } else if (!galerie[i] && value[i]) {
                // add
                modifiedIds.push(
                  dom
                    .find('.slides-container')
                    .append(
                      `<div class="slide"><img src="${value[i]}" /></div>`
                    )
                    .attr('data-sabo-id')
                )
              } else if (galerie[i] && !value[i]) {
                //remove
                const parentId = $(galerie[i])
                  .parent('.slide')
                  .parent()
                  .attr('data-sabo-id')
                $(galerie[i])
                  .parent('.slide')
                  .remove()
                modifiedIds.push(parentId)
              }
            }

            return modifiedIds

          case 'categorie':
            return [dom.attr('data-filter', cats[value]).attr('data-sabo-id')]
        }
      },
    },
  ]
})()

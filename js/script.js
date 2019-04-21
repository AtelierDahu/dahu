(function () {

    // BACKGROUND management
    const backgrounds = [
        'images/inauguration.jpg', 'images/equipe.jpg', 'images/mur.jpg', 'images/sable.jpg',
        'videos/encens.mp4', 'videos/gravure_bois.mp4'
    ]
    const bgToShow = backgrounds[
        Math.round(Math.random() * (backgrounds.length - 1))
    ]
    if (bgToShow.match(/\.(jpg)$/)) {
        $('.showroom').css('backgroundImage', `url(${bgToShow})`)
    } else {
        $('.showroom').append(`<video src="${bgToShow}" autoplay muted loop></video>`)
    }

    $('.showroom').click(() => {
        $('.showroom').fadeOut()
    })

    const showRow = name => {
        cleanSlides()
        if (!$(`.content > .row.${name}`).is(':visible')) {
            $('.content > .row').fadeOut(0)
            $(`.content > .row.${name}`).stop().fadeIn()
            cleanSlideButton()
            setTextInMenu($(`.content > .row.${name} > .content-text`))
        }
    }

    // REALISATION
    let reaTransitions = []
    const showRea = (filter, duration = 200) => {
        reaTransitions.forEach(_ => clearTimeout(_))
        reaTransitions = []
        $(filter).each((i, rea) => {
            reaTransitions.push(setTimeout(() => $(rea).stop().fadeIn(), 0))
        })
    }

    const menuButtonOpen = {}
    const toggleMenu = (menu, onlyClose) => {
        const isOpen = menuButtonOpen[menu]
        if (onlyClose && !isOpen) return
        let sign1 = isOpen ? '-' : '+'
        let sign2 = isOpen ? '+' : '-'
        $(`.menu-button.${menu}`).html($(`.menu-button.${menu}`).html().replace(sign1, sign2))
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
            $('.' + bind).removeClass(bind).html(menuText.html())
            menuText.removeAttr('ob-bind')
        }
        menuText.html('')
        return menuText
    }

    const setTextInMenu = fromElement => {
        const id = 'c' + Date.now()
        fromElement.addClass(id)
        cleanTextInMenu().attr('ob-bind', id).html(fromElement.html())
    }

    const cleanSlides = () => {
        $('.slides').fadeOut(300).each((index, slide) => {
            setTimeout(() => move_in_galery($(slide), 0, 0, true), 2000)
        })
        cleanTextInMenu()
        cleanSlideButton()
    }

    const cleanSlideButton = () => {
        $('.menu .num-button-container .num-button').each((index, elem) => {
            const bind = $(elem).attr('ob-bind')
            $('.' + bind).removeClass(bind)
            $(elem).remove()
        })
        $('.menu .num-button-container').html('')
    }

    const initSlideButton = slide => {
        cleanSlideButton()
        slide.find('.slide').each((index, elem) => {
            const id = 't' + (Date.now() * Math.random()).toFixed(0)
            $(elem).addClass(id)
            $('.menu .num-button-container').append(`<div ob-duplicable="refreshSlideButton" ob-bind="${id}" class="num-button ${index === 0 ? "current" : ""}">${index + 1}</div>`)
            $('.menu .num-button').last().click(() => move_in_galery(slide, 0, index))
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

    $('.menu-sub.realisation span').click(function() {
        const filter = `data-filter="${$(this).attr('data-filter')}"`
        $(`.rea`).stop().fadeOut(0)
        showRea(`.rea[${filter}]`)
        $('.menu-sub.realisation span.active').removeClass('active')
        $(this).addClass('active')
        cleanSlides()
    })

    $('.menu-button.atelier').click(function () {
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
    })

    /** GALERY */
    const prepare_neighbours = function (fsi, index) {
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
                $(img).removeClass('current').addClass('next')
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

    const move_in_galery = function (slides, relative, absolute, noText) {
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
        current.removeClass('next').removeClass('prev').addClass('current')

        if (currentVideo.length) {
            currentVideo.get(0).play()
        }

        const currentText = current.find('.content-text')
        if (!noText && currentText.length) {
            setTextInMenu(currentText)
        }

        $('.menu .num-button.current').removeClass('current')
        $($('.menu .num-button').get(index)).addClass('current')
    }

    /**
     * END GALERY
     */

    function placeLogo() {
        const blackLogo = $('.main.container .logo')
        const logoBlackOffset = blackLogo.offset()
        $('.showroom .logo').css({
            top: logoBlackOffset.top - scrollY,
            left: logoBlackOffset.left,

        })
        $('.showroom .logo img').css('width', blackLogo.width() + 'px')
    }

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
        rea.find('.slide').addClass('next')
        move_in_galery(rea, 0, 0)
    })

    $('.slides').fadeOut(0)

    $('.menu .logo').click(() => {
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

    if(top.location.hostname.match('octoboot.ovh')) {
        $('.slides .bt').hide()
    }

    window.octoboot_before_save = (done) => {
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
})()

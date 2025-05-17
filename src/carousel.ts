const waitForVideo = (video: HTMLVideoElement) => {
  return new Promise((resolve) => {
    if (video.readyState >= 3) {
      resolve(video);
    } else {
      video.addEventListener('loadeddata', resolve);
    }
  });
}

const waitForImage = (image: HTMLImageElement) => {
  return new Promise((resolve) => image.complete ? resolve(image) : image.addEventListener('load', resolve));
}

const waitForAllVideos = (videos: HTMLVideoElement[]) => {
  return Promise.all(videos.map(video => waitForVideo(video)));
}

const waitForAllImages = (images: HTMLImageElement[]) => {
  return Promise.all(images.map(image => waitForImage(image)));
}

// Функция debounce для оптимизации обработки событий
const debounce = (func: Function, delay: number) => {
  let timeoutId: number;
  return function(this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => func.apply(this, args), delay);
  };
};

export const initCarousel = async (id: string, speed: number) => {
    const carousel = document.getElementById(id);
    console.log(carousel)
    if (!carousel) return;

    const images = Array.from(carousel.querySelectorAll('img'));
    const videos = Array.from(carousel.querySelectorAll('video'));

    await waitForAllImages(images);
    await waitForAllVideos(videos);

    let children = Array.from(carousel.children).map(child => child.cloneNode(true));
    
    let visible = true;

    const unsubscribes: (() => void)[] = [];
    
    const createNextCarouselSlide = (element: HTMLElement, delayMS: number) => {
        const totalHeight = element.clientHeight;
        const duration = totalHeight / speed;

        if (!visible) return;
        const nextCarouselSlide = document.createElement('div');
        nextCarouselSlide.classList.add('carousel__wrapper');
        children = Array.from(element.children).map(child => child.cloneNode(true));
        nextCarouselSlide.append(...children);

        carousel.appendChild(nextCarouselSlide);
        
        const topOffset = carousel.clientHeight;
        
        const totalDuration = duration + topOffset / speed;

        nextCarouselSlide.style.setProperty('top', `${topOffset}px`);
        nextCarouselSlide.style.setProperty('transition', `transform ${totalDuration}ms linear ${delayMS}ms`); 

        const translateY = nextCarouselSlide.clientHeight + topOffset;
        nextCarouselSlide.style.setProperty('transform', `translateY(-${translateY}px)`);

        const onTransitionStart = () => {
            createNextCarouselSlide(nextCarouselSlide, duration);
        }

        const onTransitionEnd = () => {
            visible && carousel.removeChild(element);
        }

        nextCarouselSlide.addEventListener('transitionstart', onTransitionStart, { once: true });   
        nextCarouselSlide.addEventListener('transitionend', onTransitionEnd, { once: true });

        const removeListeners = () => {
            nextCarouselSlide.removeEventListener('transitionstart', onTransitionStart);
            nextCarouselSlide.removeEventListener('transitionend', onTransitionEnd);
        }

        unsubscribes.push(removeListeners);
    }

     const initFirstSlide = () => {
        const carouselWrapper = document.createElement('div');
        carouselWrapper.classList.add('carousel__wrapper');
        carouselWrapper.append(...children);
        carousel.innerHTML = '';    
        carousel.appendChild(carouselWrapper);

        const totalHeight = carouselWrapper.clientHeight;
        const duration = totalHeight / speed;
        console.log(duration, totalHeight, speed)
        carouselWrapper.style.setProperty('transition', `transform ${duration}ms linear`);
        carouselWrapper.style.setProperty('transform', `translateY(-${totalHeight}px)`);

        unsubscribes.forEach(unsubscribe => unsubscribe());
        
        createNextCarouselSlide(carouselWrapper, (totalHeight - carousel.clientHeight) / speed);
    }

    initFirstSlide()

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            visible = true;
            initFirstSlide();
        } else {
            visible = false;
        }
    });

    window.addEventListener('resize', debounce(() => {
        initFirstSlide();
    }, 100));
}

export const easeInQuad = (t, b, c, d) => c*(t/=d)*t + b;

export const easeOutQuad = (t, b, c, d) => -c *(t/=d)*(t-2) + b;

export const easeInOutQuad = (t, b, c, d) => {
    if ((t/=d/2) < 1) return c/2*t*t + b;
    return -c/2 * ((--t)*(t-2) - 1) + b;
};

export const easeInCubic = (t, b, c, d) => c*(t/=d)*t*t + b;

export const easeOutCubic = (t, b, c, d) =>  c*((t=t/d-1)*t*t + 1) + b;

export const easeInOutCubic = (t, b, c, d) => {
    if ((t/=d/2) < 1) return c/2*t*t*t + b;
    return c/2*((t-=2)*t*t + 2) + b;
};

export const easeInQuart = (t, b, c, d) => c*(t/=d)*t*t*t + b;

export const easeOutQuart = (t, b, c, d) => -c * ((t=t/d-1)*t*t*t - 1) + b;

export const easeInOutQuart = (t, b, c, d) => {
    if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
    return -c/2 * ((t-=2)*t*t*t - 2) + b;
};

export const easeInQuint = (t, b, c, d) => c*((t=t/d-1)*t*t*t*t + 1) + b;

export const easeOutQuint = (t, b, c, d) => {
    if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
    return c/2*((t-=2)*t*t*t*t + 2) + b;
};

export const easeInOutQuint = (t, b, c, d) => {
    if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
    return c/2*((t-=2)*t*t*t*t + 2) + b;
};
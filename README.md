# Gradientia - a new-tab-visualizer

a minimalist, shader-driven new tab override for chrome

![image](https://github.com/user-attachments/assets/f9c39b92-cada-4863-a74d-6e321249f302)


## ✨ features

- fullscreen animated webgl background (with noise & color params), reacts to mouse position
- dat.gui-based live customization
- google search bar, center-aligned
- (optional) quicklink panel for frequented sites

## 🧩 usage

1. clone / download the repo
2. go to `chrome://extensions`
3. enable **Developer Mode**
4. click **Load unpacked**
5. select the project folder  
6. open a new tab — behold 🌈

## 🛠 customizing

edit `main.js`, `shaders.js`, or `styles.css` to tweak behavior or looks.  
to add your own links, insert them inside the `index.html` body, inside the `.ui` container.

## 🌐 why

I wanted to replace Brave's cluttery default view with something snazzy and pretty

## 🧠 notes

- uses manifest v3  
- due to CSP, keep eval-free — `dat.gui` works, but `lil-gui` is a future candidate  
- might misbehave if you don’t reload after editing `manifest.json` — chrome quirk

## 💡 roadmap?

- persistent settings via `chrome.storage.local`
- theme toggle (light / dark modes for gui / input)
- animated quicklinks w/ svg icons?
- easter eggs?
- more content?
- shipping?

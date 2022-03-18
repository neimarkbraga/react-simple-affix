## React Affix
React Affix is a component that sticks to the viewport when scrolling until it reaches its relative element bottom point.

### Installation
`npm i react-simple-affix`

### Usage
`import Affix from 'react-simple-affix'`

```
<Affix fixedNavbarSelector="#my-navbar" relativeElementSelector="#main-content">
  <ul>
    <li><a href="/home">Home</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/about">Contact</a></li>
  </ul>
  ...
</Affix>
```

### Props
| Name | Required | Type | Description |
|------|----------|------|-------------|
| enabled | optional | boolean | enable/disable affix |
| relativeElementSelector | optional | string | selector of an element that would determine the floating stop point of affix. Default: _Parent Element_|
| fixedNavbarSelector | optional | string | selector of fixed navbar element; Affix will avoid to overlap it. (only applicable for **fixed** navbar) |
| fixedFooterSelector | optional | string | selector of fixed footer element; Affix will avoid to overlap it. (only applicable for **fixed** footer) |
| topOffset | optional | number | top offset of affix from viewport. Default: `15` |
| bottomOffset | optional | number | bottom offset of affix from viewport. Default: `15` |
| inheritParentWidth | optional | boolean | should affix follow the width of parent when its position is fixed. Default: `true` |

### Determining Relative Element
Relative element's height serves as the reference of affix to determine when it will stop floating.     

_Example_: if you have a **main** and **side** div, you can make the **main** div as the relative element...     
with this setup, affix would follow the height of **main** and will stop floating if the end of **main** div is reached


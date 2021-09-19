import React from 'react';
import PropTypes from 'prop-types';
import isRequiredIf from 'react-proptype-conditional-require';
import Popper from 'popper.js';
import deepmerge from 'deepmerge';
import is from 'is-lite';
import treeChanges from 'tree-changes';
import ReactDOM from 'react-dom';
import ExecutionEnvironment from 'exenv';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

var DEFAULTS = {flip:{padding:20},preventOverflow:{padding:10}};

var STATUS = {INIT:'init',IDLE:'idle',OPENING:'opening',OPEN:'open',CLOSING:'closing',ERROR:'error'};

var canUseDOM=ExecutionEnvironment.canUseDOM;var isReact16=ReactDOM.createPortal!==undefined;function isMobile(){return 'ontouchstart'in window&&/Mobi/.test(navigator.userAgent);}/**
 * Log method calls if debug is enabled
 *
 * @private
 * @param {Object}       arg
 * @param {string}       arg.title    - The title the logger was called from
 * @param {Object|Array} [arg.data]   - The data to be logged
 * @param {boolean}      [arg.warn]  - If true, the message will be a warning
 * @param {boolean}      [arg.debug] - Nothing will be logged unless debug is true
 */function log(_ref){var title=_ref.title,data=_ref.data,_ref$warn=_ref.warn,warn=_ref$warn===void 0?false:_ref$warn,_ref$debug=_ref.debug,debug=_ref$debug===void 0?false:_ref$debug;/* eslint-disable no-console */var logFn=warn?console.warn||console.error:console.log;if(debug&&title&&data){console.groupCollapsed("%creact-floater: ".concat(title),'color: #9b00ff; font-weight: bold; font-size: 12px;');if(Array.isArray(data)){data.forEach(function(d){if(is.plainObject(d)&&d.key){logFn.apply(console,[d.key,d.value]);}else{logFn.apply(console,[d]);}});}else{logFn.apply(console,[data]);}console.groupEnd();}/* eslint-enable */}function on(element,event,cb){var capture=arguments.length>3&&arguments[3]!==undefined?arguments[3]:false;element.addEventListener(event,cb,capture);}function off(element,event,cb){var capture=arguments.length>3&&arguments[3]!==undefined?arguments[3]:false;element.removeEventListener(event,cb,capture);}function once(element,event,cb){var capture=arguments.length>3&&arguments[3]!==undefined?arguments[3]:false;var _nextCB;// eslint-disable-next-line prefer-const
_nextCB=function nextCB(e){cb(e);off(element,event,_nextCB);};on(element,event,_nextCB,capture);}function noop(){}

var ReactFloaterPortal=/*#__PURE__*/function(_React$Component){_inherits(ReactFloaterPortal,_React$Component);function ReactFloaterPortal(props){var _this;_classCallCheck(this,ReactFloaterPortal);_this=_possibleConstructorReturn(this,_getPrototypeOf(ReactFloaterPortal).call(this,props));if(!canUseDOM)return _possibleConstructorReturn(_this);_this.node=document.createElement('div');if(props.id){_this.node.id=props.id;}if(props.zIndex){_this.node.style.zIndex=props.zIndex;}document.body.appendChild(_this.node);return _this;}_createClass(ReactFloaterPortal,[{key:"componentDidMount",value:function componentDidMount(){if(!canUseDOM)return;if(!isReact16){this.renderPortal();}}},{key:"componentDidUpdate",value:function componentDidUpdate(){if(!canUseDOM)return;if(!isReact16){this.renderPortal();}}},{key:"componentWillUnmount",value:function componentWillUnmount(){if(!canUseDOM||!this.node)return;if(!isReact16){ReactDOM.unmountComponentAtNode(this.node);}document.body.removeChild(this.node);}},{key:"renderPortal",value:function renderPortal(){if(!canUseDOM)return null;var _this$props=this.props,children=_this$props.children,setRef=_this$props.setRef;/* istanbul ignore else */if(isReact16){return ReactDOM.createPortal(children,this.node);}var portal=ReactDOM.unstable_renderSubtreeIntoContainer(this,children.length>1?React.createElement("div",null,children):children[0],this.node);setRef(portal);return null;}},{key:"renderReact16",value:function renderReact16(){var _this$props2=this.props,hasChildren=_this$props2.hasChildren,placement=_this$props2.placement,target=_this$props2.target;if(!hasChildren){if(target||placement==='center'){return this.renderPortal();}return null;}return this.renderPortal();}},{key:"render",value:function render(){if(!isReact16){return null;}return this.renderReact16();}}]);return ReactFloaterPortal;}(React.Component);_defineProperty(ReactFloaterPortal,"propTypes",{children:PropTypes.oneOfType([PropTypes.element,PropTypes.array]),hasChildren:PropTypes.bool,id:PropTypes.oneOfType([PropTypes.string,PropTypes.number]),placement:PropTypes.string,setRef:PropTypes.func.isRequired,target:PropTypes.oneOfType([PropTypes.object,PropTypes.string]),zIndex:PropTypes.number});

var FloaterArrow=/*#__PURE__*/function(_React$Component){_inherits(FloaterArrow,_React$Component);function FloaterArrow(){_classCallCheck(this,FloaterArrow);return _possibleConstructorReturn(this,_getPrototypeOf(FloaterArrow).apply(this,arguments));}_createClass(FloaterArrow,[{key:"render",value:function render(){var _this$props=this.props,placement=_this$props.placement,setArrowRef=_this$props.setArrowRef,styles=_this$props.styles;var _styles$arrow=styles.arrow,color=_styles$arrow.color,display=_styles$arrow.display,length=_styles$arrow.length,margin=_styles$arrow.margin,position=_styles$arrow.position,spread=_styles$arrow.spread;var arrowStyles={display:display,position:position};var points;var x=spread;var y=length;/* istanbul ignore else */if(placement.startsWith('top')){points="0,0 ".concat(x/2,",").concat(y," ").concat(x,",0");arrowStyles.bottom=0;arrowStyles.marginLeft=margin;arrowStyles.marginRight=margin;}else if(placement.startsWith('bottom')){points="".concat(x,",").concat(y," ").concat(x/2,",0 0,").concat(y);arrowStyles.top=0;arrowStyles.marginLeft=margin;arrowStyles.marginRight=margin;}else if(placement.startsWith('left')){y=spread;x=length;points="0,0 ".concat(x,",").concat(y/2," 0,").concat(y);arrowStyles.right=0;arrowStyles.marginTop=margin;arrowStyles.marginBottom=margin;}else if(placement.startsWith('right')){y=spread;x=length;points="".concat(x,",").concat(y," ").concat(x,",0 0,").concat(y/2);arrowStyles.left=0;arrowStyles.marginTop=margin;arrowStyles.marginBottom=margin;}return React.createElement("div",{className:"__floater__arrow",style:this.parentStyle},React.createElement("span",{ref:setArrowRef,style:arrowStyles},React.createElement("svg",{width:x,height:y,version:"1.1",xmlns:"http://www.w3.org/2000/svg"},React.createElement("polygon",{points:points,fill:color}))));}},{key:"parentStyle",get:function get(){var _this$props2=this.props,placement=_this$props2.placement,styles=_this$props2.styles;var length=styles.arrow.length;var arrow={pointerEvents:'none',position:'absolute',width:'100%'};/* istanbul ignore else */if(placement.startsWith('top')){arrow.bottom=0;arrow.left=0;arrow.right=0;arrow.height=length;}else if(placement.startsWith('bottom')){arrow.left=0;arrow.right=0;arrow.top=0;arrow.height=length;}else if(placement.startsWith('left')){arrow.right=0;arrow.top=0;arrow.bottom=0;}else if(placement.startsWith('right')){arrow.left=0;arrow.top=0;}return arrow;}}]);return FloaterArrow;}(React.Component);_defineProperty(FloaterArrow,"propTypes",{placement:PropTypes.string.isRequired,setArrowRef:PropTypes.func.isRequired,styles:PropTypes.object.isRequired});

var FloaterCloseBtn=function FloaterCloseBtn(_ref){var handleClick=_ref.handleClick,styles=_ref.styles;var color=styles.color,height=styles.height,width=styles.width,style=_objectWithoutProperties(styles,["color","height","width"]);return React.createElement("button",{"aria-label":"close",onClick:handleClick,style:style,type:"button"},React.createElement("svg",{width:"".concat(width,"px"),height:"".concat(height,"px"),viewBox:"0 0 18 18",version:"1.1",xmlns:"http://www.w3.org/2000/svg",preserveAspectRatio:"xMidYMid"},React.createElement("g",null,React.createElement("path",{d:"M8.13911129,9.00268191 L0.171521827,17.0258467 C-0.0498027049,17.248715 -0.0498027049,17.6098394 0.171521827,17.8327545 C0.28204354,17.9443526 0.427188206,17.9998706 0.572051765,17.9998706 C0.71714958,17.9998706 0.862013139,17.9443526 0.972581703,17.8327545 L9.0000937,9.74924618 L17.0276057,17.8327545 C17.1384085,17.9443526 17.2832721,17.9998706 17.4281356,17.9998706 C17.5729992,17.9998706 17.718097,17.9443526 17.8286656,17.8327545 C18.0499901,17.6098862 18.0499901,17.2487618 17.8286656,17.0258467 L9.86135722,9.00268191 L17.8340066,0.973848225 C18.0553311,0.750979934 18.0553311,0.389855532 17.8340066,0.16694039 C17.6126821,-0.0556467968 17.254037,-0.0556467968 17.0329467,0.16694039 L9.00042166,8.25611765 L0.967006424,0.167268345 C0.745681892,-0.0553188426 0.387317931,-0.0553188426 0.165993399,0.167268345 C-0.0553311331,0.390136635 -0.0553311331,0.751261038 0.165993399,0.974176179 L8.13920499,9.00268191 L8.13911129,9.00268191 Z",fill:color}))));};FloaterCloseBtn.propTypes={handleClick:PropTypes.func.isRequired,styles:PropTypes.object.isRequired};

var FloaterContainer=function FloaterContainer(_ref){var content=_ref.content,footer=_ref.footer,handleClick=_ref.handleClick,open=_ref.open,positionWrapper=_ref.positionWrapper,showCloseButton=_ref.showCloseButton,title=_ref.title,styles=_ref.styles;var output={content:React.isValidElement(content)?content:React.createElement("div",{className:"__floater__content",style:styles.content},content)};if(title){output.title=React.isValidElement(title)?title:React.createElement("div",{className:"__floater__title",style:styles.title},title);}if(footer){output.footer=React.isValidElement(footer)?footer:React.createElement("div",{className:"__floater__footer",style:styles.footer},footer);}if((showCloseButton||positionWrapper)&&!is["boolean"](open)){output.close=React.createElement(FloaterCloseBtn,{styles:styles.close,handleClick:handleClick});}return React.createElement("div",{className:"__floater__container",style:styles.container},output.close,output.title,output.content,output.footer);};FloaterContainer.propTypes={content:PropTypes.node.isRequired,footer:PropTypes.node,handleClick:PropTypes.func.isRequired,open:PropTypes.bool,positionWrapper:PropTypes.bool.isRequired,showCloseButton:PropTypes.bool.isRequired,styles:PropTypes.object.isRequired,title:PropTypes.node};

var Floater=/*#__PURE__*/function(_React$Component){_inherits(Floater,_React$Component);function Floater(){_classCallCheck(this,Floater);return _possibleConstructorReturn(this,_getPrototypeOf(Floater).apply(this,arguments));}_createClass(Floater,[{key:"render",value:function render(){var _this$props=this.props,component=_this$props.component,closeFn=_this$props.handleClick,hideArrow=_this$props.hideArrow,setFloaterRef=_this$props.setFloaterRef,status=_this$props.status;var output={};var classes=['__floater'];if(component){if(React.isValidElement(component)){output.content=React.cloneElement(component,{closeFn:closeFn});}else{output.content=component({closeFn:closeFn});}}else{output.content=React.createElement(FloaterContainer,this.props);}if(status===STATUS.OPEN){classes.push('__floater__open');}if(!hideArrow){output.arrow=React.createElement(FloaterArrow,this.props);}return React.createElement("div",{ref:setFloaterRef,className:classes.join(' '),style:this.style},React.createElement("div",{className:"__floater__body"},output.content,output.arrow));}},{key:"style",get:function get(){var _this$props2=this.props,disableAnimation=_this$props2.disableAnimation,component=_this$props2.component,placement=_this$props2.placement,hideArrow=_this$props2.hideArrow,status=_this$props2.status,styles=_this$props2.styles;var length=styles.arrow.length,floater=styles.floater,floaterCentered=styles.floaterCentered,floaterClosing=styles.floaterClosing,floaterOpening=styles.floaterOpening,floaterWithAnimation=styles.floaterWithAnimation,floaterWithComponent=styles.floaterWithComponent;var element={};if(!hideArrow){if(placement.startsWith('top')){element.padding="0 0 ".concat(length,"px");}else if(placement.startsWith('bottom')){element.padding="".concat(length,"px 0 0");}else if(placement.startsWith('left')){element.padding="0 ".concat(length,"px 0 0");}else if(placement.startsWith('right')){element.padding="0 0 0 ".concat(length,"px");}}if([STATUS.OPENING,STATUS.OPEN].indexOf(status)!==-1){element=_objectSpread2({},element,{},floaterOpening);}if(status===STATUS.CLOSING){element=_objectSpread2({},element,{},floaterClosing);}if(status===STATUS.OPEN&&!disableAnimation){element=_objectSpread2({},element,{},floaterWithAnimation);}if(placement==='center'){element=_objectSpread2({},element,{},floaterCentered);}if(component){element=_objectSpread2({},element,{},floaterWithComponent);}return _objectSpread2({},floater,{},element);}}]);return Floater;}(React.Component);_defineProperty(Floater,"propTypes",{component:PropTypes.oneOfType([PropTypes.func,PropTypes.element]),content:PropTypes.node,disableAnimation:PropTypes.bool.isRequired,footer:PropTypes.node,handleClick:PropTypes.func.isRequired,hideArrow:PropTypes.bool.isRequired,open:PropTypes.bool,placement:PropTypes.string.isRequired,positionWrapper:PropTypes.bool.isRequired,setArrowRef:PropTypes.func.isRequired,setFloaterRef:PropTypes.func.isRequired,showCloseButton:PropTypes.bool,status:PropTypes.string.isRequired,styles:PropTypes.object.isRequired,title:PropTypes.node});

var ReactFloaterWrapper=/*#__PURE__*/function(_React$Component){_inherits(ReactFloaterWrapper,_React$Component);function ReactFloaterWrapper(){_classCallCheck(this,ReactFloaterWrapper);return _possibleConstructorReturn(this,_getPrototypeOf(ReactFloaterWrapper).apply(this,arguments));}_createClass(ReactFloaterWrapper,[{key:"render",value:function render(){var _this$props=this.props,children=_this$props.children,handleClick=_this$props.handleClick,handleMouseEnter=_this$props.handleMouseEnter,handleMouseLeave=_this$props.handleMouseLeave,setChildRef=_this$props.setChildRef,setWrapperRef=_this$props.setWrapperRef,style=_this$props.style,styles=_this$props.styles;var element;/* istanbul ignore else */if(children){if(React.Children.count(children)===1){if(!React.isValidElement(children)){element=React.createElement("span",null,children);}else{var refProp=is["function"](children.type)?'innerRef':'ref';element=React.cloneElement(React.Children.only(children),_defineProperty({},refProp,setChildRef));}}else{element=children;}}if(!element){return null;}return React.createElement("span",{ref:setWrapperRef,style:_objectSpread2({},styles,{},style),onClick:handleClick,onMouseEnter:handleMouseEnter,onMouseLeave:handleMouseLeave},element);}}]);return ReactFloaterWrapper;}(React.Component);_defineProperty(ReactFloaterWrapper,"propTypes",{children:PropTypes.node,handleClick:PropTypes.func.isRequired,handleMouseEnter:PropTypes.func.isRequired,handleMouseLeave:PropTypes.func.isRequired,setChildRef:PropTypes.func.isRequired,setWrapperRef:PropTypes.func.isRequired,style:PropTypes.object,styles:PropTypes.object.isRequired});

var defaultOptions={zIndex:100};function getStyles(styles){var options=deepmerge(defaultOptions,styles.options||{});return {wrapper:{cursor:'help',display:'inline-flex',flexDirection:'column',zIndex:options.zIndex},wrapperPosition:{left:-1000,position:'absolute',top:-1000,visibility:'hidden'},floater:{display:'inline-block',filter:'drop-shadow(0 0 3px rgba(0, 0, 0, 0.3))',maxWidth:300,opacity:0,position:'relative',transition:'opacity 0.3s',visibility:'hidden',zIndex:options.zIndex},floaterOpening:{opacity:1,visibility:'visible'},floaterWithAnimation:{opacity:1,transition:'opacity 0.3s, transform 0.2s',visibility:'visible'},floaterWithComponent:{maxWidth:'100%'},floaterClosing:{opacity:0,visibility:'visible'},floaterCentered:{left:'50%',position:'fixed',top:'50%',transform:'translate(-50%, -50%)'},container:{backgroundColor:'#fff',color:'#666',minHeight:60,minWidth:200,padding:20,position:'relative',zIndex:10},title:{borderBottom:'1px solid #555',color:'#555',fontSize:18,marginBottom:5,paddingBottom:6,paddingRight:18},content:{fontSize:15},close:{backgroundColor:'transparent',border:0,borderRadius:0,color:'#555',fontSize:0,height:15,outline:'none',padding:10,position:'absolute',right:0,top:0,width:15,WebkitAppearance:'none'},footer:{borderTop:'1px solid #ccc',fontSize:13,marginTop:10,paddingTop:5},arrow:{color:'#fff',display:'inline-flex',length:16,margin:8,position:'absolute',spread:32},options:options};}

var POSITIONING_PROPS=['position','top','right','bottom','left'];var ReactFloater=/*#__PURE__*/function(_React$Component){_inherits(ReactFloater,_React$Component);function ReactFloater(props){var _this;_classCallCheck(this,ReactFloater);_this=_possibleConstructorReturn(this,_getPrototypeOf(ReactFloater).call(this,props));/* istanbul ignore else */_defineProperty(_assertThisInitialized(_this),"setArrowRef",function(ref){_this.arrowRef=ref;});_defineProperty(_assertThisInitialized(_this),"setChildRef",function(ref){_this.childRef=ref;});_defineProperty(_assertThisInitialized(_this),"setFloaterRef",function(ref){if(!_this.floaterRef){_this.floaterRef=ref;}});_defineProperty(_assertThisInitialized(_this),"setWrapperRef",function(ref){_this.wrapperRef=ref;});_defineProperty(_assertThisInitialized(_this),"handleTransitionEnd",function(){var status=_this.state.status;var callback=_this.props.callback;/* istanbul ignore else */if(_this.wrapperPopper){_this.wrapperPopper.instance.update();}_this.setState({status:status===STATUS.OPENING?STATUS.OPEN:STATUS.IDLE},function(){var newStatus=_this.state.status;callback(newStatus===STATUS.OPEN?'open':'close',_this.props);});});_defineProperty(_assertThisInitialized(_this),"handleClick",function(){var _this$props=_this.props,event=_this$props.event,open=_this$props.open;if(is["boolean"](open))return;var _this$state=_this.state,positionWrapper=_this$state.positionWrapper,status=_this$state.status;/* istanbul ignore else */if(_this.event==='click'||_this.event==='hover'&&positionWrapper){log({title:'click',data:[{event:event,status:status===STATUS.OPEN?'closing':'opening'}],debug:_this.debug});_this.toggle();}});_defineProperty(_assertThisInitialized(_this),"handleMouseEnter",function(){var _this$props2=_this.props,event=_this$props2.event,open=_this$props2.open;if(is["boolean"](open)||isMobile())return;var status=_this.state.status;/* istanbul ignore else */if(_this.event==='hover'&&status===STATUS.IDLE){log({title:'mouseEnter',data:[{key:'originalEvent',value:event}],debug:_this.debug});clearTimeout(_this.eventDelayTimeout);_this.toggle();}});_defineProperty(_assertThisInitialized(_this),"handleMouseLeave",function(){var _this$props3=_this.props,event=_this$props3.event,eventDelay=_this$props3.eventDelay,open=_this$props3.open;if(is["boolean"](open)||isMobile())return;var _this$state2=_this.state,status=_this$state2.status,positionWrapper=_this$state2.positionWrapper;/* istanbul ignore else */if(_this.event==='hover'){log({title:'mouseLeave',data:[{key:'originalEvent',value:event}],debug:_this.debug});if(!eventDelay){_this.toggle(STATUS.IDLE);}else if([STATUS.OPENING,STATUS.OPEN].indexOf(status)!==-1&&!positionWrapper&&!_this.eventDelayTimeout){_this.eventDelayTimeout=setTimeout(function(){delete _this.eventDelayTimeout;_this.toggle();},eventDelay*1000);}}});_this.state={currentPlacement:props.placement,positionWrapper:props.wrapperOptions.position&&!!props.target,status:STATUS.INIT,statusWrapper:STATUS.INIT};_this._isMounted=false;if(canUseDOM){window.addEventListener('load',function(){if(_this.popper){_this.popper.instance.update();}if(_this.wrapperPopper){_this.wrapperPopper.instance.update();}});}return _this;}_createClass(ReactFloater,[{key:"componentDidMount",value:function componentDidMount(){if(!canUseDOM)return;var positionWrapper=this.state.positionWrapper;var _this$props5=this.props,children=_this$props5.children,open=_this$props5.open,target=_this$props5.target;this._isMounted=true;log({title:'init',data:{hasChildren:!!children,hasTarget:!!target,isControlled:is["boolean"](open),positionWrapper:positionWrapper,target:this.target,floater:this.floaterRef},debug:this.debug});this.initPopper();if(!children&&target&&!is["boolean"](open));}},{key:"componentDidUpdate",value:function componentDidUpdate(prevProps,prevState){if(!canUseDOM)return;var _this$props6=this.props,autoOpen=_this$props6.autoOpen,open=_this$props6.open,target=_this$props6.target,wrapperOptions=_this$props6.wrapperOptions;var _treeChanges=treeChanges(prevState,this.state),changedFrom=_treeChanges.changedFrom,changedTo=_treeChanges.changedTo;if(prevProps.open!==open){var forceStatus;// always follow `open` in controlled mode
if(is["boolean"](open)){forceStatus=open?STATUS.OPENING:STATUS.CLOSING;}this.toggle(forceStatus);}if(prevProps.wrapperOptions.position!==wrapperOptions.position||prevProps.target!==target){this.changeWrapperPosition(this.props);}if(changedTo('status',STATUS.IDLE)&&open){this.toggle(STATUS.OPEN);}else if(changedFrom('status',STATUS.INIT,STATUS.IDLE)&&autoOpen){this.toggle(STATUS.OPEN);}if(this.popper&&changedTo('status',STATUS.OPENING)){this.popper.instance.update();}if(this.floaterRef&&(changedTo('status',STATUS.OPENING)||changedTo('status',STATUS.CLOSING))){once(this.floaterRef,'transitionend',this.handleTransitionEnd);}}},{key:"componentWillUnmount",value:function componentWillUnmount(){if(!canUseDOM)return;this._isMounted=false;if(this.popper){this.popper.instance.destroy();}if(this.wrapperPopper){this.wrapperPopper.instance.destroy();}}},{key:"initPopper",value:function initPopper(){var _this2=this;var target=arguments.length>0&&arguments[0]!==undefined?arguments[0]:this.target;var positionWrapper=this.state.positionWrapper;var _this$props7=this.props,disableFlip=_this$props7.disableFlip,getPopper=_this$props7.getPopper,hideArrow=_this$props7.hideArrow,offset=_this$props7.offset,placement=_this$props7.placement,wrapperOptions=_this$props7.wrapperOptions;var flipBehavior=placement==='top'||placement==='bottom'?'flip':['right','bottom-end','top-end','left','top-start','bottom-start'];/* istanbul ignore else */if(placement==='center'){this.setState({status:STATUS.IDLE});}else if(target&&this.floaterRef){var _this$options=this.options,arrow=_this$options.arrow,flip=_this$options.flip,offsetOptions=_this$options.offset,rest=_objectWithoutProperties(_this$options,["arrow","flip","offset"]);new Popper(target,this.floaterRef,{placement:placement,modifiers:_objectSpread2({arrow:_objectSpread2({enabled:!hideArrow,element:this.arrowRef},arrow),flip:_objectSpread2({enabled:!disableFlip,behavior:flipBehavior},flip),offset:_objectSpread2({offset:"0, ".concat(offset,"px")},offsetOptions)},rest),onCreate:function onCreate(data){_this2.popper=data;getPopper(data,'floater');if(_this2._isMounted){_this2.setState({currentPlacement:data.placement,status:STATUS.IDLE});}if(placement!==data.placement){setTimeout(function(){data.instance.update();},1);}},onUpdate:function onUpdate(data){_this2.popper=data;var currentPlacement=_this2.state.currentPlacement;if(_this2._isMounted&&data.placement!==currentPlacement){_this2.setState({currentPlacement:data.placement});}}});}if(positionWrapper){var wrapperOffset=!is.undefined(wrapperOptions.offset)?wrapperOptions.offset:0;new Popper(this.target,this.wrapperRef,{placement:wrapperOptions.placement||placement,modifiers:{arrow:{enabled:false},offset:{offset:"0, ".concat(wrapperOffset,"px")},flip:{enabled:false}},onCreate:function onCreate(data){_this2.wrapperPopper=data;if(_this2._isMounted){_this2.setState({statusWrapper:STATUS.IDLE});}getPopper(data,'wrapper');if(placement!==data.placement){setTimeout(function(){data.instance.update();},1);}}});}}},{key:"changeWrapperPosition",value:function changeWrapperPosition(_ref){var target=_ref.target,wrapperOptions=_ref.wrapperOptions;this.setState({positionWrapper:wrapperOptions.position&&!!target});}},{key:"toggle",value:function toggle(forceStatus){var status=this.state.status;var nextStatus=status===STATUS.OPEN?STATUS.CLOSING:STATUS.OPENING;if(!is.undefined(forceStatus)){nextStatus=forceStatus;}this.setState({status:nextStatus});}},{key:"render",value:function render(){var _this$state3=this.state,currentPlacement=_this$state3.currentPlacement,positionWrapper=_this$state3.positionWrapper,status=_this$state3.status;var _this$props8=this.props,children=_this$props8.children,component=_this$props8.component,content=_this$props8.content,disableAnimation=_this$props8.disableAnimation,footer=_this$props8.footer,hideArrow=_this$props8.hideArrow,id=_this$props8.id,open=_this$props8.open,showCloseButton=_this$props8.showCloseButton,style=_this$props8.style,target=_this$props8.target,title=_this$props8.title;var wrapper=React.createElement(ReactFloaterWrapper,{handleClick:this.handleClick,handleMouseEnter:this.handleMouseEnter,handleMouseLeave:this.handleMouseLeave,setChildRef:this.setChildRef,setWrapperRef:this.setWrapperRef,style:style,styles:this.styles.wrapper},children);var output={};if(positionWrapper){output.wrapperInPortal=wrapper;}else{output.wrapperAsChildren=wrapper;}return React.createElement("span",null,React.createElement(ReactFloaterPortal,{hasChildren:!!children,id:id,placement:currentPlacement,setRef:this.setFloaterRef,target:target,zIndex:this.styles.options.zIndex},React.createElement(Floater,{component:component,content:content,disableAnimation:disableAnimation,footer:footer,handleClick:this.handleClick,hideArrow:hideArrow||currentPlacement==='center',open:open,placement:currentPlacement,positionWrapper:positionWrapper,setArrowRef:this.setArrowRef,setFloaterRef:this.setFloaterRef,showCloseButton:showCloseButton,status:status,styles:this.styles,title:title}),output.wrapperInPortal),output.wrapperAsChildren);}},{key:"debug",get:function get(){var debug=this.props.debug;return debug||!!global.ReactFloaterDebug;}},{key:"event",get:function get(){var _this$props9=this.props,disableHoverToClick=_this$props9.disableHoverToClick,event=_this$props9.event;if(event==='hover'&&isMobile()&&!disableHoverToClick){return 'click';}return event;}},{key:"options",get:function get(){var options=this.props.options;return deepmerge(DEFAULTS,options||{});}},{key:"styles",get:function get(){var _this3=this;var _this$state4=this.state,status=_this$state4.status,positionWrapper=_this$state4.positionWrapper,statusWrapper=_this$state4.statusWrapper;var styles=this.props.styles;var nextStyles=deepmerge(getStyles(styles),styles);if(positionWrapper){var wrapperStyles;if(!([STATUS.IDLE].indexOf(status)!==-1)||!([STATUS.IDLE].indexOf(statusWrapper)!==-1)){wrapperStyles=nextStyles.wrapperPosition;}else{wrapperStyles=this.wrapperPopper.styles;}nextStyles.wrapper=_objectSpread2({},nextStyles.wrapper,{},wrapperStyles);}/* istanbul ignore else */if(this.target){var targetStyles=window.getComputedStyle(this.target);/* istanbul ignore else */if(this.wrapperStyles){nextStyles.wrapper=_objectSpread2({},nextStyles.wrapper,{},this.wrapperStyles);}else if(!(['relative','static'].indexOf(targetStyles.position)!==-1)){this.wrapperStyles={};if(!positionWrapper){POSITIONING_PROPS.forEach(function(d){_this3.wrapperStyles[d]=targetStyles[d];});nextStyles.wrapper=_objectSpread2({},nextStyles.wrapper,{},this.wrapperStyles);this.target.style.position='relative';this.target.style.top='auto';this.target.style.right='auto';this.target.style.bottom='auto';this.target.style.left='auto';}}}return nextStyles;}},{key:"target",get:function get(){if(!canUseDOM)return null;var target=this.props.target;if(target){if(is.domElement(target)){return target;}return document.querySelector(target);}return this.childRef||this.wrapperRef;}}]);return ReactFloater;}(React.Component);_defineProperty(ReactFloater,"propTypes",{autoOpen:PropTypes.bool,callback:PropTypes.func,children:PropTypes.node,component:isRequiredIf(PropTypes.oneOfType([PropTypes.func,PropTypes.element]),function(props){return !props.content;}),content:isRequiredIf(PropTypes.node,function(props){return !props.component;}),debug:PropTypes.bool,disableAnimation:PropTypes.bool,disableFlip:PropTypes.bool,disableHoverToClick:PropTypes.bool,event:PropTypes.oneOf(['hover','click']),eventDelay:PropTypes.number,footer:PropTypes.node,getPopper:PropTypes.func,hideArrow:PropTypes.bool,id:PropTypes.oneOfType([PropTypes.string,PropTypes.number]),offset:PropTypes.number,open:PropTypes.bool,options:PropTypes.object,placement:PropTypes.oneOf(['top','top-start','top-end','bottom','bottom-start','bottom-end','left','left-start','left-end','right','right-start','right-end','auto','center']),showCloseButton:PropTypes.bool,style:PropTypes.object,styles:PropTypes.object,target:PropTypes.oneOfType([PropTypes.object,PropTypes.string]),title:PropTypes.node,wrapperOptions:PropTypes.shape({offset:PropTypes.number,placement:PropTypes.oneOf(['top','top-start','top-end','bottom','bottom-start','bottom-end','left','left-start','left-end','right','right-start','right-end','auto']),position:PropTypes.bool})});_defineProperty(ReactFloater,"defaultProps",{autoOpen:false,callback:noop,debug:false,disableAnimation:false,disableFlip:false,disableHoverToClick:false,event:'click',eventDelay:0.4,getPopper:noop,hideArrow:false,offset:15,placement:'bottom',showCloseButton:false,styles:{},target:null,wrapperOptions:{position:false}});

export default ReactFloater;

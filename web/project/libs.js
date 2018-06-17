window.React = require('react');
window.ReactDOM = require('react-dom');
window.render = require('react-dom').render;

const PropTypes = require('prop-types');
window.Any = PropTypes.any;
window.OptionalArray = PropTypes.array;
window.OptionalBool = PropTypes.bool;
window.OptionalFunc = PropTypes.func;
window.OptionalNumber = PropTypes.number;
window.OptionalObject = PropTypes.object;
window.OptionalString = PropTypes.string;
window.OptionalNode = PropTypes.node;
window.OptionalElement = PropTypes.element;
window.oneOf = PropTypes.oneOf;
window.oneOfType = PropTypes.oneOfType;
window.RequiredArray = PropTypes.array.isRequired;
window.RequiredBool = PropTypes.bool.isRequired;
window.RequiredFunc = PropTypes.func.isRequired;
window.RequiredNumber = PropTypes.number.isRequired;
window.RequiredObject = PropTypes.object.isRequired;
window.RequiredString = PropTypes.string.isRequired;
window.RequiredNode = PropTypes.node.isRequired;
window.RequiredElement = PropTypes.node.isRequired;

window._ = {each, filter, find, partial, findIndex, range, map,cloneDeep,keyBy};

var H5P = H5P || {};

/**
 * Shape module
 *
 * @param {jQuery} $
 */
H5P.Shape = (function ($) {
  /**
   * Initialize module.
   *
   * @param {Object} params Behavior settings
   * @param {Number} id Content identification
   * @returns {C} self
   */
  function C(params, id) {
    H5P.EventDispatcher.call(this);
    this.params = $.extend(true, {
      type: 'rectangle',
      shape: {
        fillColor: '#ccc',
        borderWidth: 0,
        borderStyle: 'solid',
        borderColor: '#000',
        borderRadius: 0
      }
    }, params);
    this.contentId = id;
  }

  C.prototype = Object.create(H5P.EventDispatcher.prototype);
  C.prototype.constructor = C;

  /**
   * Attach h5p inside the given container.
   *
   * @param {jQuery} $container
   */
  C.prototype.attach = function ($container) {
    this.$inner = $container.addClass('h5p-shape');
    this.$shape = $('<div class="h5p-shape-element h5p-shape-' + this.params.type + '"></div>');
    this.findTypeAndStyle();
    this.$shape.appendTo(this.$inner);
  };

  /**
   * Is this a line?
   * @return {boolean}
   */
  C.prototype.isLine = function () {
    return this.params.type === 'vertical-line' ||
           this.params.type === 'horizontal-line';
  };

  /**
   * Is this a svg?
   * @return {boolean}
   */
  C.prototype.isSVG = function () {
    return this.params.type === 'long-arrow-right' || 
           this.params.type === 'long-arrow-left' ||
           this.params.type === 'long-arrow-up' ||
           this.params.type === 'long-arrow-down' ||
           this.params.type === 'arrows-alt-h' ||
           this.params.type === 'arrows-alt-v' ||
           this.params.type === 'arrows-alt' ||
           this.params.type === 'triangle' ||
           this.params.type === 'pentagon' ||
           this.params.type === 'hexagon' ||
           this.params.type === 'cylinder' ||
           this.params.type === 'cube' ||
           this.params.type === 'cone'
  };

  /**
   * Find type and style
   */
  C.prototype.findTypeAndStyle = function () {
    if(this.isSVG()) {
      this.styleSVG();
    } else {
      this.styleShape();
    }
  }

  /**
   * Style a svg
   */
  C.prototype.styleSVG = function () {
    let css = {};
    let thisType = this.params.type;
    let uri;

    if(thisType == 'triangle' || thisType == 'pentagon' || thisType == 'hexagon') {
      uri = this.styleSVGPolygon(thisType);
    } else if(thisType == 'cylinder' || thisType == 'cube' || thisType == 'cone') {
      uri = this.styleSVG3d(thisType); 
    } else {
      // all other svg's
      uri = this.getSVGURI(thisType);
    }
      const encoded = encodeURIComponent(uri);
      const backgroundImage = `url("data:image/svg+xml;utf8,${encoded}")`;
      css['background-image'] = backgroundImage;
      css['background-size'] = 'cover';

    this.$shape.css(css);
  }

  /**
   * Create SVG3d
   */
  C.prototype.styleSVG3d = function(type) {
    let returnURI = '';
    let colorSVG;
    let borderColor;
    
    colorSVG = this.params.svg3d.fillColor;
    borderColor = this.params.svg3d.borderColor;

    if(type == 'cylinder'){
      returnURI = `<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="80 0 355 512"><ellipse style="fill:${colorSVG};" cx="256" cy="40" rx="155" ry="40"/><ellipse style="fill:${colorSVG};" cx="256" cy="456" rx="152" ry="56"/><rect  x="104" y="56" style="fill:${colorSVG};" width="304.4" height="399.854"/><path d="M425.621,38.187C414.763,1.216,272.789,0,256,0S97.237,1.216,86.379,38.187c-0.64,1.387-1.045,2.859-1.045,4.48v426.667c0,1.621,0.405,3.093,1.045,4.48C97.237,510.784,239.211,512,256,512s158.763-1.216,169.621-38.187c0.64-1.387,1.045-2.859,1.045-4.48V42.667C426.667,41.045,426.261,39.573,425.621,38.187z M256,21.333c87.723,0,137.685,13.248,148.075,21.333C393.685,50.752,343.723,64,256,64S118.315,50.752,107.925,42.667C118.315,34.581,168.277,21.333,256,21.333z M405.333,467.989c-6.101,7.851-56.448,22.677-149.333,22.677c-93.995,0-144.619-15.211-149.333-21.333V65.429C149.312,84.544,242.603,85.333,256,85.333s106.688-0.789,149.333-19.904V467.989z" style="fill:${borderColor}"/></svg>`
    } else if(type == 'cube') {
      returnURI = `<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none' viewBox='0 0 512 512'><polygon points="185,0 20,155.826 20,500 360,500 512,350 500,0" style="fill:${colorSVG}"></polygon><path d="M511.531,8.384c-0.128-0.576-0.128-1.195-0.363-1.749c-1.088-2.645-3.179-4.736-5.824-5.824c-0.555-0.235-1.152-0.213-1.749-0.363C502.869,0.299,502.144,0,501.333,0H160c-0.619,0-1.173,0.256-1.771,0.363c-0.768,0.128-1.557,0.149-2.283,0.448c-1.323,0.555-2.496,1.323-3.499,2.325L3.115,152.469c-0.085,0.085-0.107,0.213-0.213,0.299c-0.853,0.917-1.6,1.963-2.091,3.136C0.277,157.248,0,158.635,0,160.043v341.291C0,507.221,4.779,512,10.667,512H352c1.387,0,2.773-0.277,4.075-0.832c1.195-0.491,2.219-1.237,3.157-2.091c0.085-0.085,0.213-0.107,0.299-0.192l149.333-149.333c0.981-0.981,1.771-2.176,2.304-3.477c0.299-0.747,0.341-1.515,0.469-2.304c0.107-0.597,0.363-1.152,0.363-1.771V10.667C512,9.856,511.701,9.131,511.531,8.384z M341.333,490.667h-320v-320h320V490.667z M347.584,149.333H36.416l128-128h311.168L347.584,149.333z M490.667,347.584l-128,128V164.416l128-128V347.584z" style="fill:${borderColor}"/></svg>`
    } else if(type == 'cone') {
      returnURI = `<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none' viewBox='80 0 350 512'><polygon points="256,10 410,450 100,440" style="fill:${colorSVG}"/><ellipse style="fill:${colorSVG};" cx="256" cy="460" rx="155" ry="40"/><path d="M426.624,469.269c0-0.043-0.021-0.064-0.021-0.107c0-0.597-0.235-1.131-0.32-1.707c-0.107-0.576-0.043-1.152-0.235-1.707l-0.192-0.555c-0.043-0.128-0.085-0.235-0.128-0.363l-0.448-1.301c-0.256-0.683-0.363-1.387-0.704-2.048L266.069,7.061c-0.085-0.235-0.256-0.384-0.341-0.597c-0.256-0.64-0.661-1.173-1.045-1.749c-0.384-0.576-0.747-1.173-1.237-1.664c-0.448-0.448-1.003-0.789-1.536-1.152c-0.619-0.427-1.195-0.832-1.877-1.109c-0.192-0.085-0.341-0.256-0.555-0.32c-0.469-0.171-0.96-0.107-1.451-0.192C257.365,0.149,256.747,0,256.064,0c-0.832,0-1.621,0.149-2.411,0.341c-0.384,0.085-0.768,0.021-1.152,0.171c-0.171,0.064-0.277,0.192-0.448,0.256c-0.789,0.32-1.472,0.789-2.176,1.28c-0.448,0.32-0.917,0.597-1.301,0.981c-0.533,0.533-0.939,1.152-1.344,1.813c-0.363,0.533-0.725,1.045-0.96,1.621c-0.085,0.213-0.277,0.363-0.341,0.597L87.339,461.504c-0.341,0.64-0.448,1.323-0.683,1.984l-0.789,2.24c-0.235,0.661-0.171,1.323-0.277,2.005c-0.064,0.512-0.299,0.96-0.299,1.515c0,0.107,0.064,0.213,0.064,0.32c0.021,0.661,0.213,1.28,0.363,1.92c0.171,0.896,0.341,1.771,0.725,2.603c11.669,36.629,152.768,37.824,169.515,37.824c16.768,0,158.101-1.195,169.557-37.909c0.064-0.128,0.107-0.277,0.171-0.427c0.192-0.427,0.213-0.896,0.363-1.344c0.256-0.896,0.512-1.771,0.555-2.709c0-0.043,0.021-0.085,0.021-0.128C426.603,469.333,426.624,469.312,426.624,469.269zM255.957,42.944l139.435,399.701c-45.739-15.381-126.976-16.064-139.413-16.064c-12.437,0-93.696,0.683-139.435,16.064L255.957,42.944z M255.957,490.56c-91.285,0.021-141.269-14.272-148.437-20.715c8.384-8,58.176-21.952,148.437-21.952c91.285,0,141.269,14.272,148.437,20.715C396.011,476.608,346.219,490.56,255.957,490.56z" style="fill:${borderColor}"/></svg>`
    }
    return returnURI;
  }

  /**
   * Create SVG-Polygon
   */
  C.prototype.styleSVGPolygon = function(type) {
    let returnURI = '';
    let colorSVG;
    let borderWidth;
    let borderColor;
    let borderStyle;
      
    colorSVG = this.params.svgpolygon.fillColor;
    borderWidth = parseInt(this.params.svgpolygon.borderWidth)*2;
    borderColor = this.params.svgpolygon.borderColor;
    borderStyle = this.params.svgpolygon.borderStyle;

    let dashStyle = '';
    if(borderStyle != 'solid') {
      dashStyle = 'stroke-dasharray:60';
    }
    if(type == 'triangle') {
      returnURI = `<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 600 600"><polygon points="300,20 20,580 580,580" style="fill:${colorSVG};stroke:${borderColor};stroke-width:${borderWidth};${dashStyle};"/></svg>` 
    }
    if(type == 'pentagon') {
      returnURI = `<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 600 600"><polygon points="300,20 20,200 100,580 500,580 580,200" style="fill:${colorSVG};stroke:${borderColor};stroke-width:${borderWidth};${dashStyle};"/></svg>`
    }
    if(type == 'hexagon') {
      returnURI = `<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 600 600"><polygon points="560,300 450,560 150,560 40,300 150,40 450,40" style="fill:${colorSVG};stroke:${borderColor};stroke-width:${borderWidth};${dashStyle};"/></svg>`
    }
    return returnURI;
  }

  /**
   * Get SVG-URI for all other SVGs
   */
  C.prototype.getSVGURI = function(type) {
    let returnURI = '';
    let colorSVG;

    // in case we only have one 'field' in the semantics, because then the colorSVG becomes a child of this.params.svg
    if (typeof this.params.svg === 'string') {
      colorSVG = this.params.svg;
    } else {
      colorSVG = this.params.svg.fillColor;
    }

    if (type == 'long-arrow-right') {
      returnURI = `<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 140 450 230"><g fill="${colorSVG}"><path d="M313.941 216H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h301.941v46.059c0 21.382 25.851 32.09 40.971 16.971l86.059-86.059c9.373-9.373 9.373-24.569 0-33.941l-86.059-86.059c-15.119-15.119-40.971-4.411-40.971 16.971V216z"/></g></svg>`
    } else if (type == 'long-arrow-left') {
      returnURI = `<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 140 450 230"><g fill="${colorSVG}"><path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z"/></g></svg>`
    } else if (type == 'long-arrow-up') {
      returnURI = `<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="15 30 225 450"><g fill="${colorSVG}"><path d="M88 166.059V468c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12V166.059h46.059c21.382 0 32.09-25.851 16.971-40.971l-86.059-86.059c-9.373-9.373-24.569-9.373-33.941 0l-86.059 86.059c-15.119 15.119-4.411 40.971 16.971 40.971H88z"/></g></svg>`
    } else if (type == 'long-arrow-down') {
      returnURI = `<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="15 32 225 450"><g fill="${colorSVG}"><path d="M168 345.941V44c0-6.627-5.373-12-12-12h-56c-6.627 0-12 5.373-12 12v301.941H41.941c-21.382 0-32.09 25.851-16.971 40.971l86.059 86.059c9.373 9.373 24.569 9.373 33.941 0l86.059-86.059c15.119-15.119 4.411-40.971-16.971-40.971H168z"/></g></svg>`
    } else if (type == 'arrows-alt-h') {
      returnURI = `<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 141 515 230"><g fill="${colorSVG}"><path d="M377.941 169.941V216H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.568 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296h243.882v46.059c0 21.382 25.851 32.09 40.971 16.971l86.059-86.059c9.373-9.373 9.373-24.568 0-33.941l-86.059-86.059c-15.119-15.12-40.971-4.412-40.971 16.97z"/></g></svg>`
    } else if (type == 'arrows-alt-v') {
      returnURI = `<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="17 0 225 513"><g fill="${colorSVG}"><path d="M214.059 377.941H168V134.059h46.059c21.382 0 32.09-25.851 16.971-40.971L144.971 7.029c-9.373-9.373-24.568-9.373-33.941 0L24.971 93.088c-15.119 15.119-4.411 40.971 16.971 40.971H88v243.882H41.941c-21.382 0-32.09 25.851-16.971 40.971l86.059 86.059c9.373 9.373 24.568 9.373 33.941 0l86.059-86.059c15.12-15.119 4.412-40.971-16.97-40.971z"/></g></svg>`
    } else if (type == 'arrows-alt') {
      returnURI = `<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 512 512"><g fill="${colorSVG}"><path d="M352.201 425.775l-79.196 79.196c-9.373 9.373-24.568 9.373-33.941 0l-79.196-79.196c-15.119-15.119-4.411-40.971 16.971-40.97h51.162L228 284H127.196v51.162c0 21.382-25.851 32.09-40.971 16.971L7.029 272.937c-9.373-9.373-9.373-24.569 0-33.941L86.225 159.8c15.119-15.119 40.971-4.411 40.971 16.971V228H228V127.196h-51.23c-21.382 0-32.09-25.851-16.971-40.971l79.196-79.196c9.373-9.373 24.568-9.373 33.941 0l79.196 79.196c15.119 15.119 4.411 40.971-16.971 40.971h-51.162V228h100.804v-51.162c0-21.382 25.851-32.09 40.97-16.971l79.196 79.196c9.373 9.373 9.373 24.569 0 33.941L425.773 352.2c-15.119 15.119-40.971 4.411-40.97-16.971V284H284v100.804h51.23c21.382 0 32.09 25.851 16.971 40.971z"/></g></svg>`
    }
    return returnURI;
  }
  
  /**
   * Style the shape (rectangle, circle, lines). These are made by CSS.
   */
  C.prototype.styleShape = function () {
    var props = this.isLine() ? this.params.line : this.params.shape;
    var borderWidth = (props.borderWidth * 0.0835) + 'em';
    var css = {
      'border-color': props.borderColor
    };

    if (this.params.type == "vertical-line") {
      css['border-left-width'] = borderWidth;
      css['border-left-style'] = props.borderStyle;
      this.trigger('set-size', {width: borderWidth, maxWidth: borderWidth});
    }
    else if (this.params.type == "horizontal-line") {
      css['border-top-width'] = borderWidth;
      css['border-top-style'] = props.borderStyle;
      this.trigger('set-size', {height: borderWidth, maxHeight: borderWidth});
    }
    else if(this.params.type == "rectangle" || this.params.type == "circle") {
      css['background-color'] = props.fillColor;
      css['border-width'] = borderWidth;
      css['border-style'] = props.borderStyle;
    }

    if (this.params.type == "rectangle") {
      css['border-radius'] = props.borderRadius * 0.25 + 'em';
    }

    this.$shape.css(css);
  };

  return C;
})(H5P.jQuery);

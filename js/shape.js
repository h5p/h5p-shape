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
    var self = this;
    H5P.EventDispatcher.call(this);

    self.contentId = self.id = id;

    // Set default behavior.
    self.params = $.extend({
      
    }, params);
  }

  C.prototype = Object.create(H5P.EventDispatcher.prototype);
  C.prototype.constructor = C;

  /**
   * Attach h5p inside the given container.
   *
   * @param {jQuery} $container
   */
  C.prototype.attach = function ($container) {
    var self = this;

console.log(self.params);

    self.$inner = $container
      .addClass('h5p-shape')
      .append($(
        '<div class="h5p-shape-element h5p-shape-' + self.params.type + '"></div>'
      ));
  };

  return C;
})(H5P.jQuery);

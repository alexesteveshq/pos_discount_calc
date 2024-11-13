odoo.define('pos_discount_calc.ProductScreen', function(require) {
    "use strict";

    const ProductScreen = require('point_of_sale.ProductScreen');
    const Registries = require('point_of_sale.Registries');

    const PosDiscCalcProductScreen = ProductScreen => class extends ProductScreen {
        _setValue(val) {
            if (this.currentOrder.get_selected_orderline()) {
                if (!this.env.pos.config.discount_calc){
                    super._setValue(...arguments);
                }else{
                    if (this.env.pos.numpadMode === 'quantity') {
                        const result = this.currentOrder.get_selected_orderline().set_quantity(val);
                        if (!result) NumberBuffer.reset();
                    } else if (this.env.pos.numpadMode === 'discount') {
                        this.currentOrder.get_selected_orderline().set_discount(val);
                    } else if (this.env.pos.numpadMode === 'price') {
                        var order_line = this.currentOrder.get_selected_orderline();
                        var total_price = order_line.product.lst_price
                        order_line.price_manually_set = true;
                        var current_amount = val
                        var product_taxes = this.currentOrder.pos.get_taxes_after_fp(order_line.product.taxes_id, this.currentOrder.pos.fiscal_position)
                        var current_taxes = order_line.compute_all(product_taxes, current_amount, order_line.quantity, this.currentOrder.pos.currency.rounding);
                        _(current_taxes.taxes).each(function(tax) {
                            current_amount -= tax.amount;
                        });
                        var discount = ((total_price - current_amount) / total_price) * 100
                        this.currentOrder.get_selected_orderline().set_discount(+discount.toFixed(2));
                        order_line.set_unit_price(val);
                    }
                }
            }
        }
    }

    Registries.Component.extend(ProductScreen, PosDiscCalcProductScreen);
    return ProductScreen;
});

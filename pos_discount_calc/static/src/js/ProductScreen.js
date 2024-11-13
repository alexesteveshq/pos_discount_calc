/** @odoo-module **/

import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { patch } from "@web/core/utils/patch";

patch(ProductScreen.prototype, {
    _setValue(val) {
        if (!this.currentOrder.pos.config.discount_calc){
            super._setValue(...arguments);
        }else{
            const { numpadMode } = this.pos;
            const selectedLine = this.currentOrder.get_selected_orderline();
            if (selectedLine) {
                if (numpadMode === "quantity") {
                    if (val === "remove") {
                        this.currentOrder.removeOrderline(selectedLine);
                    } else {
                        const result = selectedLine.set_quantity(val);
                        if (!result) {
                            this.numberBuffer.reset();
                        }
                    }
                } else if (numpadMode === "discount") {
                    selectedLine.set_discount(val);
                } else if (numpadMode === "price") {
                    var order_line = selectedLine
                    var total_price = order_line.product.lst_price
                    selectedLine.price_type = "manual";
                    var current_amount = val
                    var product_taxes = this.currentOrder.pos.get_taxes_after_fp(order_line.product.taxes_id, this.currentOrder.pos.fiscal_position)
                    var current_taxes = order_line.compute_all(product_taxes, current_amount, order_line.quantity, this.currentOrder.pos.currency.rounding);
                    current_taxes.taxes.forEach((tax, index) => {
                      current_amount -= tax.amount;
                    });
                    var discount = ((total_price - current_amount) / total_price) * 100
                    this.currentOrder.get_selected_orderline().set_discount(+discount.toFixed(2));
                    order_line.set_unit_price(val);
                    selectedLine.set_unit_price(val);
                }
            }
        }
    }
})
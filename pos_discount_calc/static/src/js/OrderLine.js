/** @odoo-module */

import { Orderline } from "@point_of_sale/app/store/models";
import { patch } from "@web/core/utils/patch";

patch(Orderline.prototype, {
    get_all_prices(qty = this.get_quantity()){
        if (!this.pos.config.discount_calc){
            return super.get_all_prices(...arguments);
        }
        var price_unit = this.get_unit_price() * (1.0 - this.get_discount() / 100.0);
        var taxtotal = 0;

        var product = this.get_product();
        var taxes_ids = this.tax_ids || product.taxes_id;
        taxes_ids = taxes_ids.filter((t) => t in this.pos.taxes_by_id);
        var taxdetail = {};
        var product_taxes = this.pos.get_taxes_after_fp(taxes_ids, this.order.fiscal_position);

        if (this.price_type !== "manual"){
            var price_unit = this.get_unit_price() * (1.0 - (this.get_discount() / 100.0));
        }else{
            var price_unit = this.get_unit_price()
            product_taxes.forEach(function (tax) {
                price_unit = price_unit / ((tax.amount / 100) + 1);
            });
        }

        var all_taxes = this.compute_all(
            product_taxes,
            price_unit,
            qty,
            this.pos.currency.rounding
        );
        var all_taxes_before_discount = this.compute_all(
            product_taxes,
            this.get_unit_price(),
            qty,
            this.pos.currency.rounding
        );
        all_taxes.taxes.forEach(function (tax) {
            taxtotal += tax.amount;
            taxdetail[tax.id] = {
                amount: tax.amount,
                base: tax.base,
            };
        });

        return {
            priceWithTax: all_taxes.total_included,
            priceWithoutTax: all_taxes.total_excluded,
            priceWithTaxBeforeDiscount: all_taxes_before_discount.total_included,
            priceWithoutTaxBeforeDiscount: all_taxes_before_discount.total_excluded,
            tax: taxtotal,
            taxDetails: taxdetail,
        };
    }
});
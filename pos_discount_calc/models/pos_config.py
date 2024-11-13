# -*- coding: utf-8 -*-

from odoo import fields, models, api, _


class PosConfig(models.Model):
    _inherit = 'pos.config'

    discount_calc = fields.Boolean(string='Discount calculation')

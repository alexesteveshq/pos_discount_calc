# -*- coding: utf-8 -*-

from odoo import fields, models, api, _


class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    pos_discount_calculation = fields.Boolean(related='pos_config_id.discount_calc', readonly=False)

# -*- coding: utf-8 -*-
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

{
    'name': 'POS discount calculator',
    'summary': 'POS discount calculator',
    'description': 'POS discount calculator. (POS discount | point of sale discount | discount calculate |'
                   ' discount calculation)',
    'category': 'Point of Sale',
    'author': 'Visionee',
    'version': '16.0.1.0',
    'website': 'https://visionee.net',
    'depends': [
        'point_of_sale',
    ],
    'images': [
        'static/description/banner.gif',
    ],
    'assets': {
        'point_of_sale.assets': [
            'pos_discount_calc/static/src/**/*',
        ],
    },
    'data': [
        'views/res_config_settings_views.xml',
    ],
    'license': 'OPL-1',
    'price': 20,
    'currency': "EUR",
    'installable': True,
    'auto_install': False,
}

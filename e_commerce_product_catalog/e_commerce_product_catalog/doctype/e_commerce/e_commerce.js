// Copyright (c) 2025, Krishna and contributors
// For license information, please see license.txt

frappe.ui.form.on('E-Commerce', {
    refresh: function (frm) {
        // Display a custom message on the form
        frm.dashboard.set_headline('Welcome to the E-Commerce form!');

        // Add a custom button
        frm.add_custom_button('Sync Products', function () {
            frappe.msgprint(__('Products synchronized successfully.'));
        });

        // Conditionally enable/disable a field
        if (frm.doc.status === 'Inactive') {
            frm.set_df_property('product_name', 'read_only', 1);
        } else {
            frm.set_df_property('product_name', 'read_only', 0);
        }

        // Log a message to the console
        console.log('E-Commerce form refreshed.');
    }
});

frappe.ui.form.on('E-Commerce', {
    validate: function (frm) {
        // Validate the image field
        if (frm.doc.image_field) {
            // Fetch the uploaded file details
            frappe.call({
                method: "frappe.client.get",
                args: {
                    doctype: "File",
                    name: frm.doc.image_field,
                },
                callback: function (r) {
                    if (r.message) {
                        const file = r.message;
                        
                        // Validate file size (limit to 5 MB)
                        const maxFileSize = 5 * 1024 * 1024; // 5 MB in bytes
                        if (file.file_size > maxFileSize) {
                            frappe.msgprint(__("File size exceeds 5 MB. Please upload a smaller image."));
                            frappe.validated = false;
                        }
                        
                        // Validate file format (only allow PNG, JPEG, JPG)
                        const allowedFormats = ["image/png", "image/jpeg"];
                        if (!allowedFormats.includes(file.type)) {
                            frappe.msgprint(__("Invalid file format. Please upload a PNG or JPEG image."));
                            frappe.validated = false;
                        }
                    }
                },
            });
        }
    },
});
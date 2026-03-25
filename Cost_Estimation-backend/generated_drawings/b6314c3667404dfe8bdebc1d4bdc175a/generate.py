
        import FreeCAD
        import FreeCADGui
        import Import
        import TechDraw
        import TechDrawGui

        # REQUIRED on Windows
        FreeCADGui.showMainWindow()

        doc = FreeCAD.newDocument("Doc")
        Import.insert(r"G:\New_ADA_Updated_Code\Cost_Estimation-backend\generated_drawings\b6314c3667404dfe8bdebc1d4bdc175a\becee5a5-40de-4014-8e72-9b2598213994.step", doc.Name)
        doc.recompute()

        # Only Part objects
        parts = [o for o in doc.Objects if hasattr(o, "Shape")]

        if not parts:
            raise Exception("No valid Part objects found")

        page = doc.addObject("TechDraw::DrawPage", "Page")
        template = doc.addObject("TechDraw::DrawSVGTemplate", "Template")
        template.Template = r"C:\Program Files\FreeCAD 1.0\Mod\TechDraw\Templates\A4_Landscape.svg"
        page.Template = template

        view = doc.addObject("TechDraw::DrawViewPart", "View")
        view.Source = parts
        view.ScaleType = "Automatic"
        page.addView(view)

        # CRITICAL on Windows
        doc.recompute()
        doc.saveAs(r"G:\New_ADA_Updated_Code\Cost_Estimation-backend\generated_drawings\b6314c3667404dfe8bdebc1d4bdc175a\temp.FCStd")

        TechDrawGui.exportPageAsPdf(page, r"G:\New_ADA_Updated_Code\Cost_Estimation-backend\generated_drawings\b6314c3667404dfe8bdebc1d4bdc175a\drawing.pdf")
        
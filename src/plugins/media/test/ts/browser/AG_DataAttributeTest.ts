import { GeneralSteps, Pipeline, Logger, Log } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock';
import { TinyApis, TinyLoader, TinyUi } from '@ephox/mcagar';

import Plugin from 'tinymce/plugins/media/Plugin';
import Theme from 'tinymce/themes/silver/Theme';

import Utils from '../module/test/Utils';

UnitTest.asynctest('browser.plugins.media.DataAttributeTest', function (success, failure) {
  Plugin();
  Theme();

  const sTestEmbedContentFromUrlWithAttribute = function (editor, ui, url, content) {
    return Logger.t(`Assert embeded ${content} from ${url} with attribute`, GeneralSteps.sequence([
      Utils.sOpenDialog(ui),
      Utils.sPasteSourceValue(ui, url),
      // We can't assert the DOM because tab panels don't render hidden tabs, so we check the data model
      Utils.sAssertEmbedData(editor, ui, content),
      Utils.sSubmitAndReopen(ui),
      Utils.sAssertSourceValue(ui, url),
      Utils.sCloseDialog(ui)
    ]));
  };
  const sTestEmbedContentFromUrl2 = function (editor, ui, url, url2, content, content2) {
    return Logger.t(`Assert embeded ${content} from ${url} and ${content2} from ${url2}`, GeneralSteps.sequence([
      Utils.sOpenDialog(ui),
      Utils.sPasteSourceValue(ui, url),
      Utils.sAssertEmbedData(editor, ui, content),
      Utils.sSubmitAndReopen(ui),
      Utils.sAssertSourceValue(ui, url),
      Utils.sPasteSourceValue(ui, url2),
      Utils.sAssertEmbedData(editor, ui, content2),
      Utils.sCloseDialog(ui)
    ]));
  };

  TinyLoader.setup(function (editor, onSuccess, onFailure) {
    const ui = TinyUi(editor);
    const api = TinyApis(editor);

    Pipeline.async({},
      Log.steps('TBA', 'Media: Test embeded content from url with attribute', [
        sTestEmbedContentFromUrlWithAttribute(editor, ui,
          'a',
          '<div data-ephox-embed-iri="a" style="max-width: 300px; max-height: 150px"></div>'
        ),
        sTestEmbedContentFromUrl2(editor, ui, 'a', 'b',
          '<div data-ephox-embed-iri="a" style="max-width: 300px; max-height: 150px"></div>',
          '<div data-ephox-embed-iri="b" style="max-width: 300px; max-height: 150px"></div>'
        ),
        Utils.sTestEmbedContentFromUrl(editor, ui,
          'a',
          '<div data-ephox-embed-iri="a" style="max-width: 300px; max-height: 150px"></div>'
        ),
        Utils.sAssertSizeRecalcConstrained(ui),
        Utils.sAssertSizeRecalcUnconstrained(ui),
        api.sSetContent(''),
        Utils.sAssertSizeRecalcConstrainedReopen(ui)
      ])
    , onSuccess, onFailure);
  }, {
    plugins: ['media'],
    toolbar: 'media',
    theme: 'silver',
    media_url_resolver (data, resolve) {
      resolve({ html: '<div data-ephox-embed-iri="' + data.url + '" style="max-width: 300px; max-height: 150px"></div>' });
    },
    skin_url: '/project/js/tinymce/skins/oxide',
  }, success, failure);
});
